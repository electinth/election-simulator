import Representative from './Representative';

export default class PartyWithResult {
  constructor({
    party,
    seats = 0
  }) {
    this.party = party;
    this.seats = seats;
  }

  generateRepresentatives() {
    const representatives = [];
    for (let i = 0; i < this.seats; i++) {
      representatives.push(new Representative({
        id: i,
        partyWithResult: this,
      }));
    }
    return representatives;
  }

  clone() {
    return new PartyWithResult({
      party: this.party,
      seats: this.seats
    });
  }
}
