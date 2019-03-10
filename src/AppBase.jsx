import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import ElectionResult from './models/ElectionResult';
import electionResultPresets from './data/electionResults';
import { DEFAULT_ELECTION_PRESET_INDEX } from './constants';

export default class AppBase extends React.PureComponent {
  constructor(props) {
    super(props);

    const electionResult = new ElectionResult(
      electionResultPresets[DEFAULT_ELECTION_PRESET_INDEX].result,
    );

    this.state = {
      electionResult,
      governmentConfig: {
        allyParties: new Set(),
        mainParty:
          electionResult && electionResult.partyWithResults.length > 0
            ? electionResult.getTopNParties(1)[0].party
            : null,
        senatorVotes: 0,
      },
    };
  }
}
