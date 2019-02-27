/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for, no-magic-numbers */

import React from 'react';
import PropTypes from 'prop-types';
import ElectionResult from '../models/ElectionResult';
import SeatInput from './SeatInput';
import { TOTAL_SENATOR } from '../models/rules';
import Party from '../models/Party';
import PartyColorMark from './PartyColorMark';
import './GovernmentPanel2.css';

const propTypes = {
  className: PropTypes.string,
  electionResult: PropTypes.instanceOf(ElectionResult).isRequired,
  governmentConfig: PropTypes.shape({
    allyParties: PropTypes.instanceOf(Set),
    mainParty: PropTypes.instanceOf(Party),
    senatorVotes: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func,
};
const defaultProps = {
  className: '',
  onChange() {},
};

const ALLY_PARTY_BADGE_STYLE = { marginBottom: 4, marginRight: 4 };

class GovernmentPanel extends React.PureComponent {
  update(newValue) {
    const { governmentConfig, onChange } = this.props;
    onChange({ ...governmentConfig, ...newValue });
  }

  render() {
    const { className, electionResult, governmentConfig } = this.props;
    const { mainParty, allyParties, senatorVotes } = governmentConfig;

    if (!electionResult) {
      return null;
    }

    return (
      <div className={`government-panel ${className}`}>
        <div className="table-container">
          <table className={className} style={{ marginTop: 20, marginBottom: 20 }}>
            <thead>
              <tr>
                <th />
                <th>พรรค</th>
                <th>เสียง</th>
                <th>
                  <div style={{ textAlign: 'center', marginLeft: 10, marginRight: 10 }}>
                    เป็นพรรคหลัก
                  </div>
                </th>
                <th style={{ textAlign: 'center' }}>ร่วมรัฐบาล</th>
              </tr>
            </thead>
            <tbody>
              {electionResult.partyWithResults.map(p => (
                <tr key={p.party.name} className="table table-sm">
                  <td>
                    <PartyColorMark radius={4} color={p.party.color} />
                  </td>
                  <td className="party-name">{p.party.name}</td>
                  <td style={{ textAlign: 'right' }}>{p.seats}</td>
                  <td style={{ textAlign: 'center' }}>
                    <i
                      className={`${p.party === mainParty ? 'fas' : 'far'} fa-star`}
                      onClick={() => {
                        this.update({
                          mainParty: p.party,
                        });
                      }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {p.party !== mainParty && (
                      <i
                        className={`far ${
                          allyParties.has(p.party) ? 'fa-check-square' : 'fa-square'
                        }`}
                        onClick={() => {
                          const newSet = new Set(allyParties.values());
                          if (allyParties.has(p.party)) {
                            newSet.delete(p.party);
                          } else {
                            newSet.add(p.party);
                          }
                          this.update({
                            allyParties: newSet,
                          });
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="form-group">
          <div>
            <label htmlFor="">จำนวนเสียงสนับสนุนจากส.ว.</label>
          </div>
          <SeatInput
            value={senatorVotes}
            maxValue={TOTAL_SENATOR}
            steppers={[1, 50]}
            onValueChange={newValue => {
              this.update({
                senatorVotes: newValue,
              });
            }}
          />
        </div>
      </div>
    );
  }
}

GovernmentPanel.propTypes = propTypes;
GovernmentPanel.defaultProps = defaultProps;

export default GovernmentPanel;
