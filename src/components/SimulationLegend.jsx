import React from 'react';
import PropTypes from 'prop-types';
import PartyColorMark from './PartyColorMark';
import Simulation from '../models/Simulation';

const propTypes = {
  simulation: PropTypes.instanceOf(Simulation).isRequired,
};

export default function SimulationLegend(props) {
  const { simulation } = props;
  const { mainParty, senatorVotes, allyParties } = simulation;

  return (
    <div style={{ textAlign: 'center' }}>
        {senatorVotes > 0 && (
          <span>
            <PartyColorMark shape="diamond" color={mainParty.color} /> ส.ว. &nbsp;
          </span>
        )}
        <PartyColorMark color={mainParty.color} /> {mainParty.name} ({simulation.getMainPartyResult().seats})
        {allyParties && allyParties.size > 0 && (
          <React.Fragment>
            &nbsp; <PartyColorMark shape="hollow-circle" color={mainParty.color} /> พรรคร่วมรัฐบาล:&nbsp;
            {simulation.getAllyPartyResults().map(p => (
              <div
                key={p.party.name}
                style={{ display: 'inline-block', margin: '0 2px' }}
              >
                <small>
                {p.party.name} ({p.seats})
                </small>
              </div>
            ))}
          </React.Fragment>
        )}
        {allyParties && allyParties.size < simulation.electionResult.partyWithResults.length && (
          <React.Fragment>
            &nbsp;
            <PartyColorMark shape="cross" color='#aaa' /> พรรคฝ่ายค้าน
          </React.Fragment>
        )}
    </div>
  );
}

SimulationLegend.propTypes = propTypes;
