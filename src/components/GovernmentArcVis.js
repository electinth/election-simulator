/* eslint-disable no-magic-numbers */
import { range as d3Range } from 'd3-array';
import { arc as d3Arc } from 'd3-shape';
import { SvgChart, helper } from 'd3kit';
import 'd3-transition';
import {
  TOTAL_SENATOR,
  PRIME_MINISTER_THRESHOLD,
  COUNCIL_THRESHOLD,
  TOTAL_REPRESENTATIVE,
} from '../models/rules';

function compare(a, b) {
  const diff = a.angle - b.angle;
  if (diff === 0) {
    return b.ringIndex - a.ringIndex;
  }

  return diff;
}

class GovernmentVis extends SvgChart {
  static getDefaultOptions() {
    return helper.deepExtend(super.getDefaultOptions(), {
      glyphRadius: 2.5,
      innerRadius: 80,
      outerRadius: 154,
      rings: [64, 62, 56, 52, 50, 50, 48, 44, 38, 36],
      gapBetweenCouncil: 10,
      margin: {
        left: 6,
        right: 6,
        bottom: 10,
      },
    });
  }

  static getCustomEventNames() {
    return [];
  }

  constructor(element, options) {
    super(element, options);

    this.layers.create(['arc', 'senator', 'representative', 'council-annotation', 'pm-annotation']);
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
    this.layers
      .get('arc')
      .append('path')
      .classed('progress', true);

    this.visualize = this.visualize.bind(this);
    this.on('data', this.visualize);
    this.on('options', this.visualize);
    this.on('resize', this.visualize);
  }

  computeLayout() {
    this.repPositions = [];
    this.senatorPositions = [];
    const { innerRadius, outerRadius, rings } = this.options();

    const gapBetweenRings = (outerRadius - innerRadius) / (rings.length - 1);
    rings.forEach((r, ringIndex) => {
      const angleStep = 180 / (r - 1);
      const ringRadius = outerRadius - ringIndex * gapBetweenRings;
      for (let i = 0; i < r; i++) {
        const angle = angleStep * i;
        const radianAngle = ((180 + angle) * Math.PI) / 180;
        this.repPositions.push({
          angle,
          ringIndex,
          x: Math.cos(radianAngle) * ringRadius,
          y: Math.sin(radianAngle) * ringRadius,
        });

        const radianAngle2 = (angle * Math.PI) / 180;
        this.senatorPositions.push({
          angle,
          ringIndex,
          x: Math.cos(radianAngle2) * ringRadius,
          y: Math.sin(radianAngle2) * ringRadius,
        });
      }
    });

    this.repPositions.sort(compare);
    this.senatorPositions.sort(compare);
  }

  visualize() {
    if (!this.hasData() || !this.hasNonZeroArea()) return;

    const { glyphRadius, outerRadius, margin, gapBetweenCouncil } = this.options();

    const simulation = this.data();

    const size = outerRadius * 2 + glyphRadius * 2 + 4;
    this.dimension([
      size + margin.left + margin.right,
      size + gapBetweenCouncil + margin.top + margin.bottom,
    ]);

    this.computeLayout();
    this.renderRepresentatives();
    this.renderSenators();
    this.renderPMAnnotation();
    this.renderCouncilAnnotation();
    this.renderArc();
  }

  renderRepresentatives() {
    const simulation = this.data();
    const { glyphRadius, gapBetweenCouncil } = this.options();
    const { mainParty, allyParties } = simulation;

    const representatives = simulation.generateRepresentatives();
    representatives.forEach((r, i) => {
      r.position = this.repPositions[i];
      r.isMainParty = r.partyWithResult.party === mainParty;
      r.isAlly = allyParties.has(r.partyWithResult.party);
    });

    const selection = this.layers
      .get('representative')
      .attr(
        'transform',
        `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2 -
          gapBetweenCouncil / 2})`,
      )
      .selectAll('g.representative')
      .data(representatives, d => d.key());

    selection.exit().remove();

    selection
      .enter()
      .append('g')
      .classed('representative', true)
      .attr('transform', ({ position }) => `translate(${position.x}, ${position.y})`)
      .append('path')
      .attr('transform', ({ position }) => `rotate(${position.angle})`)
      .attr('d', d =>
        d.isMainParty || d.isAlly
          ? `m ${-glyphRadius},0 a ${glyphRadius},${glyphRadius} 0 1,0 ${glyphRadius *
              2},0 a ${glyphRadius},${glyphRadius} 0 1,0 ${-glyphRadius * 2},0`
          : `M${-glyphRadius},${-glyphRadius} L${glyphRadius},${glyphRadius} M${-glyphRadius},${glyphRadius} L${glyphRadius},${-glyphRadius}`,
      )
      // .attr('r', d => (d.isMainParty ? R : R - 1))
      .style('opacity', d => (d.isMainParty || d.isAlly ? 1 : 0.5))
      .attr('fill', d => (!d.isAlly ? d.partyWithResult.party.color : 'rgba(0,0,0,0)'))
      .attr('stroke', d => (d.isAlly ? mainParty.color : d.partyWithResult.party.color))
      .attr('stroke-width', '1.5px');

    selection
      // .transition()
      .attr('transform', ({ position }) => `translate(${position.x}, ${position.y})`);

    selection
      .select('path')
      // .transition()
      .attr('d', d =>
        d.isMainParty || d.isAlly
          ? `m${-glyphRadius},0 a ${glyphRadius},${glyphRadius} 0 1,0 ${glyphRadius *
              2},0 a ${glyphRadius},${glyphRadius} 0 1,0 ${-glyphRadius * 2},0`
          : `M${-glyphRadius},${-glyphRadius} L${glyphRadius},${glyphRadius} M${-glyphRadius},${glyphRadius} L${glyphRadius},${-glyphRadius}`,
      )
      .style('opacity', d => (d.isMainParty || d.isAlly ? 1 : 0.5))
      .attr('fill', d => (!d.isAlly ? d.partyWithResult.party.color : 'rgba(0,0,0,0)'))
      .attr('stroke', d => (d.isAlly ? mainParty.color : d.partyWithResult.party.color));
  }

  renderSenators() {
    const simulation = this.data();
    const { glyphRadius, gapBetweenCouncil } = this.options();
    const { senatorVotes, mainParty } = simulation;

    const len = this.senatorPositions.length;
    const senators = d3Range(0, TOTAL_SENATOR).map(id => {
      const isAlly = id < senatorVotes;

      return {
        isAlly,
        position: this.senatorPositions[isAlly ? len - id - 1 : id - senatorVotes],
      };
    });

    const selection = this.layers
      .get('senator')
      .attr(
        'transform',
        `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2 +
          gapBetweenCouncil / 2})`,
      )
      .selectAll('g')
      .data(senators);

    selection.exit().remove();

    selection
      .enter()
      .append('g')
      .classed('senator', true)
      .attr('transform', ({ position }) => `translate(${position.x}, ${position.y})`)
      .append('rect')
      .attr('transform', ({ position }) => `rotate(${position.angle + 45})`)
      .attr('height', (glyphRadius - 0.5) * 2)
      .attr('width', (glyphRadius - 0.5) * 2)
      .attr('rx', 1)
      .attr('fill', d => (d.isAlly ? mainParty.color : '#999'));

    selection.attr('transform', ({ position }) => `translate(${position.x}, ${position.y})`);

    selection.select('rect').attr('fill', d => (d.isAlly ? mainParty.color : '#999'));
  }

  renderPMAnnotation() {
    const { senatorVotes } = this.data();
    const { innerRadius, outerRadius, gapBetweenCouncil } = this.options();

    const layer = this.layers
      .get('pm-annotation')
      .attr(
        'transform',
        `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2 -
          gapBetweenCouncil / 2})`,
      );

    const angle = ((PRIME_MINISTER_THRESHOLD - senatorVotes) / 500) * 180;
    const radianAngle = ((angle + 180) * Math.PI) / 180;
    const radius = outerRadius + 10;
    const x = Math.cos(radianAngle) * radius;
    const y = Math.sin(radianAngle) * radius;
    const radius2 = innerRadius - 10;
    const x2 = Math.cos(radianAngle) * radius2;
    const y2 = Math.sin(radianAngle) * radius2;

    layer
      .select('path.threshold')
      .transition()
      .attr('d', `M${x2},${y2} L${x},${y}`)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', '2px');
    // .attr('stroke-dasharray', '2,4');

    layer
      .select('text.caption')
      .transition()
      .attr('transform', `translate(${x},${y})rotate(${angle + 270})`)
      .attr('dy', -5)
      .attr('dx', 0)
      // .attr('x', x + 2)
      // .attr('y', y - 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'normal')
      .text('ได้นายกฯ');
  }

  renderCouncilAnnotation() {
    const { innerRadius, outerRadius, gapBetweenCouncil } = this.options();

    const layer = this.layers
      .get('council-annotation')
      .attr(
        'transform',
        `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2 -
          gapBetweenCouncil / 2})`,
      );

    const angle = (COUNCIL_THRESHOLD / 500) * 180;
    const radianAngle = ((angle + 180) * Math.PI) / 180;
    const radius = outerRadius + 10;
    const x = Math.cos(radianAngle) * radius;
    const y = Math.sin(radianAngle) * radius;
    const radius2 = innerRadius - 10;
    const x2 = Math.cos(radianAngle) * radius2;
    const y2 = Math.sin(radianAngle) * radius2;

    layer
      .select('path.threshold')
      .transition()
      .attr('d', `M${x2},${y2} L${x},${y}`)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', '2px');
    // .attr('stroke-dasharray', '2,4');

    layer
      .select('text.caption')
      .transition()
      .attr('transform', `translate(${x},${y})rotate(${angle + 270})`)
      .attr('dy', -5)
      .attr('dx', 0)
      // .attr('x', x + 2)
      // .attr('y', y - 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'normal')
      .text('ได้สภาฯ');
  }

  renderArc() {
    const simulation = this.data();
    const { innerRadius, outerRadius, gapBetweenCouncil } = this.options();
    const { totalSeats, senatorVotes, mainParty } = simulation;

    const layer = this.layers
      .get('arc')
      .attr('transform', `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2})`);

    layer
      .select('path.progress')
      .attr(
        'd',
        d3Arc()({
          y: -gapBetweenCouncil / 2,
          innerRadius: innerRadius - 5,
          outerRadius: outerRadius + 10,
          startAngle: ((-90 - (senatorVotes / TOTAL_SENATOR) * 90) * Math.PI) / 180,
          endAngle: ((-90 + (totalSeats / TOTAL_REPRESENTATIVE) * 180) * Math.PI) / 180,
        }),
      )
      .attr('fill', mainParty.color)
      .style('opacity', 0.5);
  }
}

export default GovernmentVis;
