import { sum as d3Sum } from 'd3-array';
import { PRIME_MINISTER_THRESHOLD, COUNCIL_THRESHOLD } from './rules';

export default class Simulation {
  constructor({ electionResult, senatorVotes, mainParty, allyParties }) {
    this.electionResult = electionResult;
    this.senatorVotes = senatorVotes;
    this.mainParty = mainParty;
    this.allyParties = allyParties;
    this.totalSeats = d3Sum(
      electionResult
        .getPartiesWithSeats()
        .filter(p => p.party === mainParty || allyParties.has(p.party)),
      p => p.seats,
    );
  }

  canElectPrimeMinister() {
    return this.totalSeats + this.senatorVotes > PRIME_MINISTER_THRESHOLD;
  }

  seatsToElectPrimeMinister() {
    return Math.max(0, PRIME_MINISTER_THRESHOLD - (this.totalSeats + this.senatorVotes));
  }

  winCouncil() {
    return this.totalSeats > COUNCIL_THRESHOLD;
  }

  seatsToWinCouncil() {
    return Math.max(0, COUNCIL_THRESHOLD - this.totalSeats);
  }

  printSummary() {
    if (this.canElectPrimeMinister() && this.winCouncil()) {
      return 'ได้จัดตั้งรัฐบาล!';
    } else if (this.canElectPrimeMinister()) {
      return `มีเสียงพอเลือกนายกฯ แต่ไม่ได้เสียงส่วนใหญ่ในสภา (ขาดอีก ${this.seatsToWinCouncil()})`;
    } else if (this.winCouncil()) {
      return `ได้เสียงข้างมากในสภา แต่ไม่ได้เลือกนายกฯ (ขาดอีก ${this.seatsToElectPrimeMinister()})!`;
    }

    return `ได้เสียงไม่พอ (ขาดอีก ${this.seatsToElectPrimeMinister()} เพื่อเลือกนายกฯ และ ขาดอีก ${this.seatsToWinCouncil()} เพื่อให้ได้เสียงข้างมากในสภาฯ)`;
  }

  generateRepresentatives() {
    const representatives = this.electionResult.generateRepresentatives();

    return representatives
      .filter(r => r.partyWithResult.party === this.mainParty)
      .concat(representatives.filter(r => this.allyParties.has(r.partyWithResult.party)))
      .concat(
        representatives.filter(
          r =>
            r.partyWithResult.party !== this.mainParty &&
            !this.allyParties.has(r.partyWithResult.party),
        ),
      );
  }

  getMainPartyResult() {
    return this.electionResult.getPartiesWithSeats().filter(p => p.party === this.mainParty)[0];
  }

  getAllyPartyResults() {
    return this.electionResult.getPartiesWithSeats().filter(p => this.allyParties.has(p.party));
  }

  getOppositePartyResults() {
    return this.electionResult
      .getPartiesWithSeats()
      .filter(p => !this.allyParties.has(p.party) && p.party !== this.mainParty);
  }

  toFormula() {
    return [this.mainParty.name]
      .concat(this.getAllyPartyResults().map(p => p.party.name))
      .join(' + ');
  }
}
