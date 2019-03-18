import Party from './Party';

export default class GovernmentConfig {
  constructor({ mainParty, allyParties = [], senatorVotes = 0 }) {
    this.mainParty = Party.getOrCreate({ name: mainParty });
    this.allyParties = new Set(allyParties);
    this.senatorVotes = senatorVotes;
  }

  toObject() {
    const { mainParty, allyParties, senatorVotes } = this;

    return {
      allyParties: Array.from(allyParties),
      mainParty: mainParty.name,
      senatorVotes,
    };
  }
}
