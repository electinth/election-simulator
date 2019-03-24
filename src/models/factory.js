import { keyBy, flow, mapValues } from 'lodash/fp';
import { sum as d3Sum } from 'd3-array';

const parties = [
  'เพื่อไทย',
  'พลังประชารัฐ',
  'ประชาธิปัตย์',
  'ภูมิใจไทย',
  'เสรีรวมไทย',
  'ชาติไทยพัฒนา',
  'ชาติพัฒนา',
  'อนาคตใหม่',
  'เพื่อชาติ',
  'เศรษฐกิจใหม่',
];

/* eslint-disable import/prefer-default-export */
export function randomizeResults() {
  const misc = Math.round(Math.random() * 20) + 10;
  const results = parties.map(p => ({
    name: p,
    value: Math.random(),
  }));
  const totalSeatsNotMisc = 500 - misc;
  const total = d3Sum(results, r => r.value);
  results.forEach(r => {
    r.value = Math.round((r.value / total) * totalSeatsNotMisc);
  });

  return flow(
    keyBy(d => d.name),
    mapValues(v => v.value),
  )(results);
}
