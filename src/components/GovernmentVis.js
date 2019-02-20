/* eslint-disable no-magic-numbers */
import { range as d3Range } from 'd3-array';
import { SvgChart, helper } from 'd3kit';

const GAP = 3;
const COLUMN_SIZE = 25;
const R = 4;

class GovernmentVis extends SvgChart {
  static getDefaultOptions() {
    return helper.deepExtend(super.getDefaultOptions(), {
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

    // this.layers.create([]);

    this.visualize = this.visualize.bind(this);
    this.on('data', this.visualize);
    this.on('options', this.visualize);
    this.on('resize', this.visualize);
  }

  visualize() {
    if (!this.hasData() || !this.hasNonZeroArea()) return;

    const simulation = this.data();

    const { mainParty, senatorVotes } = simulation;

    const gapBetweenCouncil = 5;
    const senateLeftColumnCount = Math.ceil(senatorVotes / COLUMN_SIZE);
    const senateRightColumnCount = Math.ceil((250 - senatorVotes) / COLUMN_SIZE);
    const senateLeftWidth =
      senateLeftColumnCount > 0
        ? senateLeftColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const senateRightWidth =
      senateRightColumnCount > 0
        ? senateRightColumnCount * (R * 2 + GAP) + GAP + gapBetweenCouncil
        : 0;
    const repWidth = (500 / COLUMN_SIZE) * (R * 2 + GAP) + GAP;
    const width = senateLeftWidth + repWidth + senateRightWidth;
    const height = COLUMN_SIZE * (R * 2 + GAP) + GAP;
    const margin = {
      bottom: 40,
      top: 40,
    };
    this.dimension([width, height + margin.bottom + margin.top]);

    this.rootG.selectAll('*').remove();

    const mainG = this.rootG.append('g');

    mainG
      .append('g')
      .classed('senate-left-layer', true)
      .attr('transform', `translate(${R + GAP}, ${R + GAP})`)
      .selectAll('g.senator')
      .data(d3Range(0, senatorVotes))
      .enter()
      .append('g')
      .classed('senator', true)
      .attr(
        'transform',
        i =>
          `translate(${Math.floor(i / COLUMN_SIZE) * (2 * R + GAP)}, ${(i % COLUMN_SIZE) *
            (2 * R + GAP)})`,
      )
      .append('rect')
      // .attr('transform', 'rotate(45)')
      .attr('height', (R - 1) * 2)
      .attr('width', (R - 1) * 2)
      .attr('x', 1 - R)
      .attr('y', 1 - R)
      .attr('rx', 1)
      .attr('fill', mainParty.color);

    mainG
      .append('g')
      .classed('senate-right-layer', true)
      .attr(
        'transform',
        `translate(${R + GAP + senateLeftWidth + gapBetweenCouncil + repWidth}, ${R + GAP})`,
      )
      .selectAll('g.senator')
      .data(d3Range(0, 250 - senatorVotes))
      .enter()
      .append('g')
      .classed('senator', true)
      .attr(
        'transform',
        i =>
          `translate(${Math.floor(i / COLUMN_SIZE) * (2 * R + GAP)}, ${(i % COLUMN_SIZE) *
            (2 * R + GAP)})`,
      )
      .append('rect')
      // .attr('transform', 'rotate(45)')
      .attr('height', (R - 1) * 2)
      .attr('width', (R - 1) * 2)
      .attr('x', 1 - R)
      .attr('y', 1 - R)
      .attr('rx', 1)
      .attr('fill', '#999');

    mainG
      .append('g')
      .classed('rep-layer', true)
      .attr('transform', `translate(${R + GAP + senateLeftWidth}, ${R + GAP})`)
      .selectAll('g.representative')
      .data(simulation.generateRepresentatives())
      .enter()
      .append('g')
      .classed('representative', true)
      .attr(
        'transform',
        (d, i) =>
          `translate(${Math.floor(i / COLUMN_SIZE) * (2 * R + GAP)}, ${(i % COLUMN_SIZE) *
            (2 * R + GAP)})`,
      )
      .append('circle')
      .attr('r', d => (d.isAlly ? R - 1 : R))
      .attr('fill', d => (!d.isAlly ? d.partyWithResult.party.color : 'rgba(0,0,0,0)'))
      .attr('stroke', d => (d.isAlly ? mainParty.color : 'none'))
      .attr('stroke-width', '2px');
    {
      const repCountForPrimeMinister = 376 - senatorVotes;
      const cutX =
        senateLeftWidth +
        (Math.floor(repCountForPrimeMinister / COLUMN_SIZE) + 1) * (2 * R + GAP) +
        GAP / 2;
      const cutY = (repCountForPrimeMinister % COLUMN_SIZE) * (2 * R + GAP) + GAP / 2;
      const cutX2 = repCountForPrimeMinister % COLUMN_SIZE === 0 ? cutX : cutX - R * 2 - GAP;
      mainG
        .append('path')
        .attr('d', `M${cutX},-5 L${cutX},${cutY} L${cutX2},${cutY} L${cutX2},${height}`)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', '2px')
        .attr('stroke-dasharray', '6,4');

      mainG
        .append('text')
        .attr('x', cutX)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'normal')
        .text('ได้เลือกนายกฯ');
    }
    {
      const repCountForMajority = 251;
      const cutX =
        senateLeftWidth +
        (Math.floor(repCountForMajority / COLUMN_SIZE) + 1) * (2 * R + GAP) +
        GAP / 2;
      const cutY = (repCountForMajority % COLUMN_SIZE) * (2 * R + GAP) + GAP / 2;
      const cutX2 = repCountForMajority % COLUMN_SIZE === 0 ? cutX : cutX - R * 2 - GAP;
      mainG
        .append('path')
        .attr('d', `M${cutX},0 L${cutX},${cutY} L${cutX2},${cutY} L${cutX2},${height + 5}`)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-width', '2px')
        .attr('stroke-dasharray', '6,4');

      mainG
        .append('text')
        .attr('x', cutX)
        .attr('y', height + 18)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'normal')
        .text('กุมเสียงส่วนใหญ่ในสภาผู้แทนราษฎร');
    }
  }
}

export default GovernmentVis;
