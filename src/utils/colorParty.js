/* eslint-disable sort-keys */

import { scaleOrdinal } from 'd3-scale';

// const colorMap = {
//   ชาติไทยพัฒนา: '#1F5D52',
//   เพื่อไทย: '#DE0505',
//   อนาคตใหม่: '#F47932',
//   ไทยรักษาชาติ: '#FA9BCC',
//   รวมพลังประชาชาติไทย: '#F6CD4A',
//   พลังประชารัฐ: '#546D40',
//   ประชาธิปัตย์: '#40BDE7',
//   ภูมิใจไทย: '#005FFF',
//   ประชาชาติ: '#0C3B86',
//   เพื่อชาติ: '#7077C5',
//   เพื่อธรรม: '#EB1970',
//   อื่นๆ: '#ccc',
// };

const colorMap = {
  เพื่อไทย: '#E60012',
  ประชาธิปัตย์: '#1FBDE2',
  พลังประชารัฐ: '#516D46',
  ภูมิใจไทย: '#0462F4',
  ไทยรักษาชาติ: '#FF99C8',
  ชาติไทยพัฒนา: '#0F5D53',
  ชาติพัฒนา: '#083C80',
  อนาคตใหม่: '#FA7640',
  เพื่อชาติ: '#7178BE',
  รวมพลังประชาชาติไทย: '#F7CB62',
  อื่นๆ: '#C6C7C8',
};

const parties = Object.keys(colorMap);
const colors = parties.map(party => colorMap[party]);
const scale = scaleOrdinal()
  .domain(parties)
  .range(colors);

export default scale;
