/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for, no-magic-numbers */

import React from 'react';
import PropTypes from 'prop-types';
import ElectionResult from '../models/ElectionResult';
import { TOTAL_SENATOR } from '../models/rules';
import GovernmentConfig from '../models/GovernmentConfig';
import Simulation from '../models/Simulation';
import Breadcrumb from './Breadcrumb';
import PartyColorMark from './PartyColorMark';
import SeatInput from './SeatInput';
import './GovernmentFormulaTable.css';

const propTypes = {
  className: PropTypes.string,
  electionResult: PropTypes.instanceOf(ElectionResult).isRequired,
  governmentConfig: PropTypes.instanceOf(GovernmentConfig).isRequired,
  onChange: PropTypes.func,
  simulation: PropTypes.instanceOf(Simulation).isRequired,
};
const defaultProps = {
  className: '',
  onChange() {},
};

class GovernmentFormulaTable extends React.PureComponent {
  update(newValue) {
    const { governmentConfig, onChange } = this.props;
    onChange(governmentConfig.set(newValue));
  }

  render() {
    const { className, electionResult, governmentConfig, simulation } = this.props;
    const { mainParty, allyParties, senatorVotes } = governmentConfig;

    if (!electionResult) {
      return null;
    }

    return (
      <div className={`government-formula-table ${className}`}>
        <div className="table-subsection">
          <div className="page-content">
            <Breadcrumb page={2} />
            <h3>2. จัดตั้งรัฐบาล</h3>
            <div className="form-group">
              <label htmlFor="">จำนวนเสียงสนับสนุนจากส.ว.</label>
              <SeatInput
                value={senatorVotes}
                maxValue={TOTAL_SENATOR}
                steppers={[250]}
                onValueChange={newValue => {
                  this.update({
                    senatorVotes: newValue,
                  });
                }}
              />
            </div>
            <div className="table-container">
              <table className={className} style={{ marginBottom: 20 }}>
                <thead>
                  <tr>
                    <th className="government-formula-table-title">พรรคหลัก</th>
                    <th className="government-formula-table-title">ร่วมรัฐบาล</th>
                    <th className="government-formula-table-title">เสียง</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {electionResult.partyWithResults.map(p => (
                    <tr key={p.party.name} className="table table-sm">
                      <td style={{ textAlign: 'center' }}>
                        <i
                          role="button"
                          className={`${p.party === mainParty ? 'fas' : 'far'} fa-star`}
                          onClick={e => {
                            e.preventDefault();
                            const newSet = new Set(allyParties.values());
                            if (allyParties.has(p.party)) {
                              newSet.delete(p.party);
                            }
                            this.update({
                              allyParties: newSet,
                              mainParty: p.party,
                            });
                          }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {p.party !== mainParty && (
                          <i
                            role="button"
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
                      <td style={{ textAlign: 'right' }}>{p.seats}</td>
                      <td>
                        <PartyColorMark radius={5} color={p.party.color} />
                      </td>
                      <td className="party-name">{p.party.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="senator-subsection" />
        <div className="result-subsection">
          <div className="col text-align-center">
            เสียงส.ส. + ส.ว.
            <div className="big-number">
              <i
                className={`far ${
                  simulation.canElectPrimeMinister()
                    ? 'fa-check-circle fa-icon-green'
                    : 'fa-times-circle fa-icon-red'
                }`}
              />
              &nbsp;{simulation.totalSeats + simulation.senatorVotes}
            </div>
            <div>
              {simulation.canElectPrimeMinister() ? 'ได้เลือกนายก!' : <span>ไม่ได้เลือกนายก</span>}
            </div>
          </div>
          <div className="col text-align-center">
            เสียงส.ส.
            <div className="big-number">
              <i
                className={`far ${
                  simulation.winCouncil()
                    ? 'fa-check-circle fa-icon-green'
                    : 'fa-times-circle fa-icon-red'
                }`}
              />
              &nbsp;{simulation.totalSeats}
            </div>
            <div>
              {simulation.winCouncil() ? 'คุมสภาผู้แทนฯได้!' : <span>คุมสภาผู้แทนฯไม่ได้</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GovernmentFormulaTable.propTypes = propTypes;
GovernmentFormulaTable.defaultProps = defaultProps;

export default GovernmentFormulaTable;
