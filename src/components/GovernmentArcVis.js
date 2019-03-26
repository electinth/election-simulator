/* eslint-disable no-magic-numbers */
import { range as d3Range } from 'd3-array';
import { interpolate } from 'd3-interpolate';
import { arc as d3Arc } from 'd3-shape';
import { SvgChart, helper } from 'd3kit';
import 'd3-transition';
import { round } from 'lodash';
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
      gapBetweenCouncil: 2,
      glyphRadius: 2.5,
      innerRadius: 80,
      margin: {
        bottom: 5,
        left: 6,
        right: 6,
        top: 38,
      },
      outerRadius: 154,
      rings: [64, 62, 56, 52, 50, 50, 48, 44, 38, 36],
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
      .classed('progress', true)
      .datum({});

    this.visualize = this.visualize.bind(this);
    this.on('data', this.visualize);
    this.on('options', this.visualize);
    this.on('resize', this.visualize);
  }

  computeLayout() {
    this.repPositions = [];
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
          x: round(Math.cos(radianAngle) * ringRadius, 2),
          y: round(Math.sin(radianAngle) * ringRadius, 2),
        });

        // const radianAngle2 = (angle * Math.PI) / 180;
        // this.senatorPositions.push({
        //   angle,
        //   ringIndex,
        //   x: round(Math.cos(radianAngle2) * ringRadius, 2),
        //   y: round(Math.sin(radianAngle2) * ringRadius, 2),
        // });
      }
    });

    this.repPositions.sort(compare);
    // this.senatorPositions.sort(compare);
  }

  visualize() {
    if (!this.hasData() || !this.hasNonZeroArea()) return;

    const { glyphRadius, outerRadius, margin, gapBetweenCouncil } = this.options();

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
    representatives.forEach((rep, i) => {
      const r = rep;
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
      .attr('fill', d => (d.isAlly ? 'rgba(0,0,0,0)' : d.partyWithResult.party.color))
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
      .attr('fill', d => (d.isAlly ? 'rgba(0,0,0,0)' : d.partyWithResult.party.color))
      .attr('stroke', d => (d.isAlly ? mainParty.color : d.partyWithResult.party.color));
  }

  renderSenators() {
    const simulation = this.data();
    const { glyphRadius, gapBetweenCouncil } = this.options();
    const { senatorVotes, mainParty } = simulation;

    const OFFSET = 10;
    const len = this.repPositions.length;
    const senators = d3Range(0, TOTAL_SENATOR).map(id => {
      const isAlly = id < senatorVotes;
      const oppositeSenatorVotes = TOTAL_SENATOR - senatorVotes;

      return {
        id,
        isAlly,
        position: this.repPositions[
          isAlly ? len - id - 1 - OFFSET : oppositeSenatorVotes - 1 - id + senatorVotes + OFFSET
        ],
      };
    });

    const selection = this.layers
      .get('senator')
      .attr(
        'transform',
        `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2 +
          gapBetweenCouncil / 2})rotate(180)`,
      )
      .selectAll('g')
      .data(senators, d => d.id);

    selection.exit().remove();

    const g = selection
      .enter()
      .append('g')
      .classed('senator', true)
      .attr('transform', ({ position }) => `translate(${position.x}, ${position.y})`);

    g.append('rect')
      .attr('transform', ({ position }) => `rotate(${position.angle + 45})`)
      .attr('x', -glyphRadius)
      .attr('y', -glyphRadius)
      .attr('height', (glyphRadius - 0.5) * 2)
      .attr('width', (glyphRadius - 0.5) * 2)
      .attr('rx', 1)
      .attr('fill', d => (d.isAlly ? mainParty.color : '#999'));

    selection
      .transition()
      .duration(500)
      .attr('transform', ({ position }) => `translate(${position.x}, ${position.y})`);

    selection
      .select('rect')
      .transition()
      .attr('transform', ({ position }) => `rotate(${position.angle + 45})`)
      .attr('fill', d => (d.isAlly ? mainParty.color : '#999'));
  }

  renderPMAnnotation() {
    const { senatorVotes } = this.data();
    const { innerRadius, outerRadius, gapBetweenCouncil } = this.options();

    const angle = ((PRIME_MINISTER_THRESHOLD - senatorVotes) / 500) * 180 + 90;
    const radius = outerRadius + 20;
    const x = 0;
    const y = radius;
    const radius2 = innerRadius - 10;
    const x2 = 0;
    const y2 = radius2;

    const layer = this.layers
      .get('pm-annotation')
      .transition()
      .duration(500)
      .attr(
        'transform',
        `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2 -
          gapBetweenCouncil / 2})rotate(${angle})`,
      );

    layer
      .select('path.threshold')
      // .transition()
      .attr('d', `M${x2},${y2} L${x},${y}`)
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', '1px');

    layer
      .select('text.caption')
      // .transition()
      .attr('transform', `translate(${x},${y})rotate(180)`)
      .attr('dy', -5)
      .attr('dx', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#999')
      .text('ได้นายกฯ (376)');
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
    const radius2 = innerRadius - 24;
    const x2 = Math.cos(radianAngle) * radius2;
    const y2 = Math.sin(radianAngle) * radius2;

    layer
      .select('path.threshold')
      // .transition()
      .attr('d', `M${x2},${y2} L${x},${y}`)
      .attr('fill', 'none')
      .attr('stroke', '#666')
      .attr('stroke-width', '1px');

    layer
      .select('text.caption')
      // .transition()
      .attr('transform', `translate(${x},${y2})rotate(${angle + 270})`)
      .attr('dy', 14)
      .attr('dx', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#999')
      .text('ได้สภาฯ (251)');
  }

  renderArc() {
    const simulation = this.data();
    const { innerRadius, outerRadius } = this.options();
    const { totalSeats, senatorVotes, mainParty } = simulation;

    const layer = this.layers
      .get('arc')
      .attr('transform', `translate(${this.getInnerWidth() / 2},${this.getInnerHeight() / 2})`);

    const path = layer.select('path.progress');

    const arc = d3Arc()
      .innerRadius(innerRadius - 10)
      .outerRadius(outerRadius + 10)
      .cornerRadius(4);

    function arcTween({ startAngle, endAngle }) {
      return function tween(d) {
        const prevStartAngle = d.startAngle || 0;
        const prevEndAngle = d.endAngle || 0;
        const datum = d;
        datum.startAngle = startAngle;
        datum.endAngle = endAngle;
        // interpolate both its starting and ending angles
        const interpolateStart = interpolate(prevStartAngle || 0, startAngle);
        const interpolateEnd = interpolate(prevEndAngle || 0, endAngle);

        return function draw(t) {
          return arc({
            endAngle: interpolateEnd(t),
            startAngle: interpolateStart(t),
          });
        };
      };
    }

    path
      .transition()
      .delay(300)
      .duration(500)
      .attrTween(
        'd',
        arcTween({
          endAngle: ((-90 + (totalSeats / TOTAL_REPRESENTATIVE) * 180) * Math.PI) / 180,
          startAngle: ((-90 - ((senatorVotes + 10) / TOTAL_SENATOR) * 90) * Math.PI) / 180,
        }),
      )
      .attr('fill', mainParty.color)
      .style('opacity', 0.2);
  }
}

export default GovernmentVis;
