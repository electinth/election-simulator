import ElectionResult from './ElectionResult';
import electionResultPresets from '../data/electionResults';
import { DEFAULT_ELECTION_PRESET_INDEX } from '../constants';
import GovernmentConfig from './GovernmentConfig';

export default class State {
  constructor({ electionResultPreset, electionResult, governmentConfig }) {
    if (electionResultPreset) {
      this.electionResultPreset = electionResultPreset;
      if (electionResultPreset === 'CUSTOM') {
        this.electionResult = new ElectionResult(electionResult);
      } else {
        this.electionResult = new ElectionResult(
          electionResultPresets[Number(this.electionResultPreset)].result,
        );
      }
    } else if (electionResult) {
      this.electionResultPreset = 'CUSTOM';
      this.electionResult = new ElectionResult(electionResult);
    } else {
      this.electionResultPreset = DEFAULT_ELECTION_PRESET_INDEX;
      this.electionResult = new ElectionResult(
        electionResultPresets[DEFAULT_ELECTION_PRESET_INDEX].result,
      );
    }

    this.governmentConfig = new GovernmentConfig(
      governmentConfig || {
        mainParty:
          electionResult && electionResult.partyWithResults.length > 0
            ? electionResult.getTopNParties(1)[0].party
            : null,
      },
    );
  }

  toUrlParams() {
    const { electionResultPreset, electionResult, governmentConfig } = this.governmentConfig;
    const output = {
      gov: governmentConfig.toObject(),
    };
    if (electionResultPreset === 'CUSTOM') {
      output.election = electionResult.toObject();
    } else {
      output.preset = electionResultPreset;
    }

    return output;
  }
}

State.fromUrlParams = function fromUrlParams({ preset, election, gov }) {
  return new State({
    electionResult: election,
    electionResultPreset: preset,
    governmentConfig: gov,
  });
};
