import React from 'react';
import PropTypes from 'prop-types';
import PartyColorMark from './PartyColorMark';
import Simulation from '../models/Simulation';
import { TOTAL_SENATOR } from '../models/rules';
import './SimulationLegend.css';

const propTypes = {
  simulation: PropTypes.instanceOf(Simulation).isRequired,
};

export default function SimulationLegend(props) {
  const { simulation } = props;
  const { mainParty, senatorVotes, allyParties } = simulation;

  const oppositeParties = simulation.getOppositePartyResults();

  return (
    <div className="simulation-legend">
      <table align="center" style={{ textAlign: 'left' }}>
        <tbody>
          <tr>
            <td className="legend-column">
              <PartyColorMark color={mainParty.color} /> {mainParty.name} (
              {simulation.getMainPartyResult().seats})
              {allyParties && allyParties.size > 0 && (
                <div>
                  <PartyColorMark shape="hollow-circle" color={mainParty.color} /> พรรคร่วมรัฐบาล
                  <br />
                  {simulation.getAllyPartyResults().map(p => (
                    <div key={p.party.name} style={{ margin: '0 2px 0 14px' }}>
                      <small>
                        {p.party.name} ({p.seats})
                      </small>
                    </div>
                  ))}
                </div>
              )}
              {senatorVotes > 0 && (
                <div style={{ borderTop: '1px dotted #ccc' }}>
                  <PartyColorMark shape="diamond" color={mainParty.color} /> ส.ว. ({senatorVotes})
                </div>
              )}
            </td>
            <td className="legend-column" style={{ textAlign: 'right' }}>
              {oppositeParties.length > 0 && (
                <div>
                  <div style={{ margin: '0 14px 0 2px' }}>พรรคฝ่ายค้าน</div>
                  {oppositeParties.map(p => (
                    <div key={p.party.name}>
                      <small>
                        {p.party.name} ({p.seats}){' '}
                        <PartyColorMark shape="cross" color={p.party.color} />
                      </small>
                    </div>
                  ))}
                </div>
              )}
              {senatorVotes < TOTAL_SENATOR && (
                <div style={{ borderTop: '1px dotted #ccc' }}>
                  ส.ว. ({TOTAL_SENATOR - senatorVotes})&nbsp;
                  <PartyColorMark shape="diamond" color="#aaa" />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

SimulationLegend.propTypes = propTypes;
