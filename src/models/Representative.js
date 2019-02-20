export default class Representative {
  constructor({ id, partyWithResult }) {
    this.partyWithResult = partyWithResult;
    this.id = id;
  }

  key() {
    return `${this.partyWithResult.party.name}-${this.id}`;
  }
}
