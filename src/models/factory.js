import Party, { REMAINDER_PARTY_NAME } from './Party';
import PartyWithResult from './PartyWithResult';
import ElectionResult from './ElectionResult';

export default function createElectionResult(input) {
  return new ElectionResult(
    Object.keys(input)
      .filter(name => name !== REMAINDER_PARTY_NAME)
      .map(
        name =>
          new PartyWithResult({
            party: Party.getOrCreate({ name }),
            seats: input[name],
          }),
      ),
  );
}
