import { mapValues, entries } from 'lodash';
import ElectionResult from './ElectionResult';
import electionResultPresets from '../data/electionResults';
import { DEFAULT_ELECTION_PRESET } from '../constants';
import GovernmentConfig from './GovernmentConfig';

export default class State {
  constructor(input = {}) {
    if (input instanceof State) {
      const { currentPage, electionResultPreset, electionResult, governmentConfig } = input;
      this.currentPage = currentPage;
      this.electionResultPreset = electionResultPreset;
      this.electionResult = electionResult;
      this.governmentConfig = governmentConfig;
    } else {
      const { currentPage = 0, electionResultPreset, electionResult, governmentConfig } = input;
      this.currentPage = currentPage;

      if (electionResultPreset) {
        this.electionResultPreset = electionResultPreset;
        if (electionResultPreset === 'CUSTOM') {
          this.electionResult = new ElectionResult(electionResult);
        } else {
          this.electionResult = new ElectionResult(
            electionResultPresets[this.electionResultPreset].result,
          );
        }
      } else if (electionResult) {
        this.electionResultPreset = 'CUSTOM';
        this.electionResult = new ElectionResult(electionResult);
      } else {
        this.electionResultPreset = DEFAULT_ELECTION_PRESET;
        this.electionResult = new ElectionResult(
          electionResultPresets[DEFAULT_ELECTION_PRESET].result,
        );
      }

      this.governmentConfig = new GovernmentConfig(
        governmentConfig || {
          mainParty:
            this.electionResult.partyWithResults.length > 0
              ? this.electionResult.getTopNParties(1)[0].party
              : null,
        },
      );
    }
  }

  clone() {
    return new State(this);
  }

  set(partialState) {
    const clone = this.clone();

    return Object.assign(clone, partialState);
  }

  toUrlParams() {
    const { electionResultPreset, electionResult, governmentConfig } = this;
    const output = {
      gov: governmentConfig.toObject(),
    };
    if (electionResultPreset === 'CUSTOM') {
      output.election = electionResult.toObject();
    } else {
      output.preset = electionResultPreset;
    }

    return entries(mapValues(output, v => encodeURIComponent(JSON.stringify(v))))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}

State.fromUrlParams = function fromUrlParams(paramsString) {
  const params = {};
  paramsString
    .replace('?', '')
    .split('&')
    .filter(x => x.length > 0)
    .forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = JSON.parse(decodeURIComponent(value));
    });

  const { page, preset, election, gov } = params;

  return new State({
    currentPage: page,
    electionResult: election,
    electionResultPreset: preset,
    governmentConfig: gov,
  });
};
