/* eslint-disable no-magic-numbers */
import { range as d3Range } from 'd3-array';
import { SvgChart, helper } from 'd3kit';
import 'd3-transition';
import { TOTAL_SENATOR } from '../models/rules';

const GAP = 3;
const R = 4;

class GovernmentVis extends SvgChart {
  static getDefaultOptions() {
    return helper.deepExtend(super.getDefaultOptions(), {
      gapBetweenCouncil: 5,
      columnSize: 25,
      margin: {
        left: 0,
        right: 0,
      },
    });
  }

  static getCustomEventNames() {
    return [];
  }

  constructor(element, options) {
    super(element, options);

    this.layers.create(['senator', 'representative', 'council-annotation', 'pm-annotation']);
    this.layers
      .get('council-annotation')
      .append('path')
      .classed('threshold', true);
    this.layers
      .get('council-annotation')
      .append('text')
      .classed('caption', true);
    this.layers
      .get('pm-annotation')
      .append('path')
      .classed('threshold', true);
    this.layers
      .get('pm-annotation')
      .append('text')
      .classed('caption', true);

    this.visualize = this.visualize.bind(this);
    this.on('data', this.visualize);
    this.on('options', this.visualize);
    this.on('resize', this.visualize);
  }

  visualize() {
    if (!this.hasData() || !this.hasNonZeroArea()) return;

    const simulation = this.data();
    const { columnSize, gapBetweenCouncil } = this.options();

    const { senatorVotes } = simulation;

    const senateLeftColumnCount = Math.ceil(senatorVotes / columnSize);
    const senateRightColumnCount = Math.ceil((250 - senatorVotes) / columnSize);
    const senateLeftWidth =
      senateLeftColumnCount > 0
        ? senateLeftColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const senateRightWidth =
      senateRightColumnCount > 0
        ? senateRightColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const repWidth = (500 / columnSize) * (R * 2 + GAP) + GAP;
    const width = senateLeftWidth + repWidth + senateRightWidth;
    const height = columnSize * (R * 2 + GAP) + GAP;
    const margin = {
      bottom: 40,
      top: 40,
    };
    this.dimension([width, height + margin.bottom + margin.top]);

    this.renderSenates();

    this.layers
      .get('representative')
      .transition()
      .attr('transform', `translate(${R + GAP + senateLeftWidth}, ${R + GAP})`);

    this.renderRepresentatives();
    this.renderPMAnnotation();
    this.renderCouncilAnnotation();
  }

  renderSenates() {
    const simulation = this.data();
    const { columnSize, gapBetweenCouncil } = this.options();
    const { senatorVotes, mainParty } = simulation;

    const senateLeftColumnCount = Math.ceil(senatorVotes / columnSize);
    const senateLeftWidth =
      senateLeftColumnCount > 0
        ? senateLeftColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const repWidth = (500 / columnSize) * (R * 2 + GAP) + GAP;

    const senators = d3Range(0, TOTAL_SENATOR).map(id => {
      const isAlly = id < senatorVotes;
      let x;
      let i;
      if (isAlly) {
        x = R + GAP;
        i = id;
      } else {
        x = R + GAP + senateLeftWidth + gapBetweenCouncil + repWidth;
        i = id - senatorVotes;
      }
      x += Math.floor(i / columnSize) * (2 * R + GAP);
      const y = R + GAP + (i % columnSize) * (2 * R + GAP);

      return {
        i,
        id,
        isAlly,
        x,
        y,
      };
    });

    const selection = this.layers
      .get('senator')
      .selectAll('g.senator')
      .data(senators, d => d.id);

    selection
      .enter()
      .append('g')
      .classed('senator', true)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .append('rect')
      // .attr('transform', 'rotate(45)')
      .attr('height', (R - 1) * 2)
      .attr('width', (R - 1) * 2)
      .attr('x', 1 - R)
      .attr('y', 1 - R)
      .attr('rx', 1)
      .attr('fill', d => (d.isAlly ? mainParty.color : '#999'));

    selection.transition().attr('transform', d => `translate(${d.x}, ${d.y})`);

    selection
      .select('rect')
      .transition()
      .attr('fill', d => (d.isAlly ? mainParty.color : '#999'));

    selection.exit().remove();
  }

  renderRepresentatives() {
    const simulation = this.data();
    const { columnSize } = this.options();
    const { mainParty, allyParties } = simulation;

    const representatives = simulation.generateRepresentatives();
    representatives.forEach(r => {
      r.isAlly = allyParties.has(r.partyWithResult.party);
    });

    const selection = this.layers
      .get('representative')
      .selectAll('g.representative')
      .data(representatives, d => d.key());

    selection
      .enter()
      .append('g')
      .classed('representative', true)
      .attr(
        'transform',
        (d, i) =>
          `translate(${Math.floor(i / columnSize) * (2 * R + GAP)}, ${(i % columnSize) *
            (2 * R + GAP)})`,
      )
      .append('circle')
      .attr('r', d => (d.isAlly ? R - 1 : R))
      .attr('fill', d => (!d.isAlly ? d.partyWithResult.party.color : 'rgba(0,0,0,0)'))
      .attr('stroke', d => (d.isAlly ? mainParty.color : 'none'))
      .attr('stroke-width', '2px');

    selection
      .transition()
      .attr(
        'transform',
        (d, i) =>
          `translate(${Math.floor(i / columnSize) * (2 * R + GAP)}, ${(i % columnSize) *
            (2 * R + GAP)})`,
      );

    selection
      .select('circle')
      .transition()
      .attr('r', d => (d.isAlly ? R - 1 : R))
      .attr('fill', d => (!d.isAlly ? d.partyWithResult.party.color : 'rgba(0,0,0,0)'))
      .attr('stroke', d => (d.isAlly ? mainParty.color : 'none'));
  }

  renderCouncilAnnotation() {
    const { columnSize, gapBetweenCouncil } = this.options();
    const { senatorVotes } = this.data();
    const senateLeftColumnCount = Math.ceil(senatorVotes / columnSize);
    const senateLeftWidth =
      senateLeftColumnCount > 0
        ? senateLeftColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const height = columnSize * (R * 2 + GAP) + GAP;

    const repCountForMajority = 251;
    const cutX =
      senateLeftWidth +
      (Math.floor(repCountForMajority / columnSize) + 1) * (2 * R + GAP) +
      GAP / 2;
    const cutY = (repCountForMajority % columnSize) * (2 * R + GAP) + GAP / 2;
    const cutX2 = repCountForMajority % columnSize === 0 ? cutX : cutX - R * 2 - GAP;

    this.layers
      .get('council-annotation')
      .select('path.threshold')
      .transition()
      .attr('d', `M${cutX},0 L${cutX},${cutY} L${cutX2},${cutY} L${cutX2},${height + 5}`)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', '2px')
      .attr('stroke-dasharray', '6,4');

    this.layers
      .get('council-annotation')
      .select('text.caption')
      .transition()
      .attr('x', cutX)
      .attr('y', height + 18)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'normal')
      .text('กุมเสียงส่วนใหญ่ในสภาผู้แทนราษฎร');
  }

  renderPMAnnotation() {
    const { columnSize, gapBetweenCouncil } = this.options();
    const { senatorVotes } = this.data();

    const senateLeftColumnCount = Math.ceil(senatorVotes / columnSize);
    const senateLeftWidth =
      senateLeftColumnCount > 0
        ? senateLeftColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const height = columnSize * (R * 2 + GAP) + GAP;

    const repCountForPrimeMinister = 376 - senatorVotes;
    const cutX =
      senateLeftWidth +
      (Math.floor(repCountForPrimeMinister / columnSize) + 1) * (2 * R + GAP) +
      GAP / 2;
    const cutY = (repCountForPrimeMinister % columnSize) * (2 * R + GAP) + GAP / 2;
    const cutX2 = repCountForPrimeMinister % columnSize === 0 ? cutX : cutX - R * 2 - GAP;

    this.layers
      .get('pm-annotation')
      .select('path.threshold')
      .transition()
      .attr('d', `M${cutX},-5 L${cutX},${cutY} L${cutX2},${cutY} L${cutX2},${height}`)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', '2px')
      .attr('stroke-dasharray', '6,4');

    this.layers
      .get('pm-annotation')
      .select('text.caption')
      .transition()
      .attr('x', cutX)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'normal')
      .text('ได้เลือกนายกฯ');
  }
}

export default GovernmentVis;
