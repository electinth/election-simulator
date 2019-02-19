export default class Simulation {
  constructor({ electionResult, senatorVotes, mainParty, allyParties }) {
    this.electionResult = electionResult;
    this.senatorVotes = senatorVotes;
    this.mainParty = mainParty;
    this.allyParties = allyParties;
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
        representatives.filter(r => r.partyWithResult.party !== this.mainParty && !this.allyParties.has(r.partyWithResult.party)),
      );
  }
}
