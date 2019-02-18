import { sum as d3Sum } from 'd3-array';
import { TOTAL_REPRESENTATIVE } from './rules';

export default class ElectionResult {
  constructor(partyWithResults) {
    this.partyWithResults = partyWithResults.concat().sort((a, b) => b.seats - a.seats);
    const count = d3Sum(this.partyWithResults, p => p.seats);
    this.isOverflow = TOTAL_REPRESENTATIVE - count >= 0;
  }

  getPartiesWithSeats() {
    return this.partyWithResults.filter(p => p.seats > 0);
  }

  getTopNParties(n = 3) {
    return this.getPartiesWithSeats().slice(0, n);
  }

  getPotentialAllies(mainPartyName) {
    return this.getPartiesWithSeats().filter(p => p.name !== mainPartyName);
  }

  clone() {
    return new ElectionResult(this.partyWithResults.map(p => p.clone()));
  }
}
