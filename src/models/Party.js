import colorParty from '../utils/colorParty';

export default class Party {
  constructor({ id, name, shortName, color }) {
    this.name = name;
    this.id = id || name;
    this.shortName = shortName || name;
    this.color = color || colorParty(name);
  }
}

const partyCache = {};

Party.getOrCreate = function getOrCreate(input) {
  const { name } = input;
  const cachedParty = partyCache[name];
  if (cachedParty) {
    return cachedParty;
  }
  const party = new Party(input);
  partyCache[name] = party;

  return party;
};

export const REMAINDER_PARTY_NAME = 'อื่นๆ';
