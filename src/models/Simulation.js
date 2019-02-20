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

  printResult() {
    return 'lorem ipsum dolor sit amet';
  }

  generateRepresentatives() {
    const representatives = this.electionResult.generateRepresentatives();

    return representatives
      .filter(r => r.partyWithResult.party === this.mainParty)
      .map(r => ({
        ...r,
        isSelected: true,
      }))
      .concat(
        representatives
          .filter(r => this.allyParties.has(r.partyWithResult.party))
          .map(r => ({
            ...r,
            isAlly: true,
          })),
      )
      .concat(
        representatives.filter(
          r =>
            r.partyWithResult.party !== this.mainParty &&
            !this.allyParties.has(r.partyWithResult.party),
        ).reverse(),
      );
  }
}
