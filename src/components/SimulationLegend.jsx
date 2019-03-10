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
      <small className="party-name">
        {senatorVotes > 0 && (
          <span>
            <PartyColorMark shape="round-rect" color={mainParty.color} /> ส.ว. &nbsp;
          </span>
        )}
        <PartyColorMark color={mainParty.color} /> {mainParty.name}
        {allyParties && allyParties.size > 0 && (
          <React.Fragment>
            &nbsp; <PartyColorMark shape="hollow-circle" color={mainParty.color} /> พรรคร่วมรัฐบาล (
            {allyParties.size} พรรค)
          </React.Fragment>
        )}
      </small>
    </div>
  );
}

SimulationLegend.propTypes = propTypes;
