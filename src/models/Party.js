export default class Party {
  constructor({ id, name, shortName, color }) {
    this.id = id;
    this.name = name;
    this.shortName = shortName || name;
    this.color = color;
  }
}
