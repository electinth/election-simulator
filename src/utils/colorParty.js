import { scaleOrdinal } from 'd3-scale';

const PARTIES = [
  'ชาติไทยพัฒนา',
  'เพื่อไทย',
  'อนาคตใหม่',
  'ไทยรักษาชาติ',
  'รวมพลังประชาชาติไทย',
  'พลังประชารัฐ',
  'ประชาธิปัตย์',
  'ภูมิใจไทย',
  'ประชาชาติ',
  'เพื่อชาติ',
  'เพื่อธรรม',
  'อื่นๆ',
];

const COLORS = [
  '#1F5D52',
  '#DE0505',
  '#F47932',
  '#FA9BCC',
  '#F6CD4A',
  '#546D40',
  '#40BDE7',
  '#005FFF',
  '#0C3B86',
  '#7077C5',
  '#EB1970',
  '#ccc',
];

const scale = scaleOrdinal.domain(PARTIES).range(COLORS);

export default scale;
