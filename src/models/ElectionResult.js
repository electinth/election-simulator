import { sum as d3Sum } from 'd3-array';
import { flatMap } from 'lodash';
import PartyWithResult from './PartyWithResult';
import Party, { REMAINDER_PARTY_NAME } from './Party';
import { TOTAL_REPRESENTATIVE } from './rules';

export default class ElectionResult {
  // input is PartyWithResult[] or plain object with party name as key and seats as value.
  constructor(input) {
    const partyWithResults = Array.isArray(input)
      ? input
      : Object.keys(input)
          .filter(name => name !== REMAINDER_PARTY_NAME)
          .map(
            name =>
              new PartyWithResult({
                party: Party.getOrCreate({
                  name,
                }),
                seats: input[name],
              }),
          );

    this.partyWithResults = partyWithResults
      .filter(p => p.party.name !== REMAINDER_PARTY_NAME)
      .concat()
      .sort((a, b) => b.seats - a.seats);
    this.totalSeats = d3Sum(this.partyWithResults, p => p.seats);

    if (this.totalSeats < TOTAL_REPRESENTATIVE) {
      this.partyWithResults.push(
        new PartyWithResult({
          party: Party.getOrCreate({ name: REMAINDER_PARTY_NAME }),
          seats: TOTAL_REPRESENTATIVE - this.totalSeats,
        }),
      );
    }
  }

  isOverflow() {
    return this.totalSeats > TOTAL_REPRESENTATIVE;
  }

  getPartiesWithSeats() {
    return this.partyWithResults.filter(p => p.seats > 0);
  }

  getTopNParties(n = 3) {
    return this.getPartiesWithSeats().slice(0, n);
  }

  getPotentialAllies(mainPartyName) {
    return this.getPartiesWithSeats().filter(p => p.party.name !== mainPartyName);
  }

  generateRepresentatives() {
    return flatMap(this.getPartiesWithSeats().map(p => p.generateRepresentatives()));
  }

  cloneAndUpdateSeats(partyName, newSeats) {
    return new ElectionResult(
      this.partyWithResults.map(p => {
        const clone = p.clone();
        if (p.party.name === partyName) {
          clone.seats = newSeats;
        }

        return clone;
      }),
    );
  }

  clone() {
    return new ElectionResult(this.partyWithResults.map(p => p.clone()));
  }
}
