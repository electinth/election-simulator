import Party from './Party';

export default class GovernmentConfig {
  constructor(input) {
    if (input instanceof GovernmentConfig) {
      const { mainParty, allyParties, senatorVotes } = input;
      this.mainParty = mainParty;
      this.allyParties = allyParties;
      this.senatorVotes = senatorVotes;
    } else {
      const { mainParty, allyParties = [], senatorVotes = 0 } = input;
      this.mainParty =
        mainParty instanceof Party ? mainParty : Party.getOrCreate({ name: mainParty });
      this.allyParties = new Set(
        allyParties.map(p => (p instanceof Party ? p : Party.getOrCreate({ name: p }))),
      );
      this.senatorVotes = senatorVotes;
    }
  }

  clone() {
    return new GovernmentConfig(this);
  }

  set(partialState) {
    const clone = this.clone();

    return Object.assign(clone, partialState);
  }

  toObject() {
    const { mainParty, allyParties, senatorVotes } = this;

    return {
      allyParties: Array.from(allyParties).map(p => p.name),
      mainParty: mainParty.name,
      senatorVotes,
    };
  }
}
