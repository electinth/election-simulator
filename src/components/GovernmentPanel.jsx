/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import ElectionResult from '../models/ElectionResult';
import SeatInput from './SeatInput';
import { TOTAL_SENATOR } from '../models/rules';

const propTypes = {
  className: PropTypes.string,
  electionResult: PropTypes.instanceOf(ElectionResult).isRequired,
  onChange: PropTypes.func,
};
const defaultProps = {
  className: '',
  onChange() {},
};

class GovernmentPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allyParties: new Set(),
      mainParty: null,
      senatorVotes: 250,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { mainParty } = this.state;
    const { electionResult } = nextProps;
    if (electionResult && !mainParty) {
      this.update({ mainParty: electionResult.getTopNParties(1)[0].party });
    }
  }

  update(newValue) {
    const { onChange } = this.props;
    this.setState(newValue);
    onChange({ ...this.state, ...newValue });
  }

  render() {
    const { className, electionResult } = this.props;
    const { mainParty, allyParties, senatorVotes } = this.state;

    if (!electionResult) {
      return null;
    }

    return (
      <div className={className}>
        <div className="form-group row">
          <legend htmlFor="" className="col-sm-3 col-form-label pt-0">
            เลือกพรรคหลัก
          </legend>
          <div className="col-sm-9">
            {electionResult.getTopNParties().map(p => (
              <div key={p.party.name} className="custom-control custom-radio custom-control-inline">
                <input
                  className="custom-control-input"
                  type="radio"
                  name="main-party-radio"
                  id={`main-party-radio-${p.party.name}`}
                  value={p.party.name}
                  checked={p.party === mainParty}
                  onChange={() => {
                    this.update({
                      mainParty: p.party,
                    });
                  }}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`main-party-radio-${p.party.name}`}
                >
                  {p.party.name} ({p.seats})
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="" className="col-sm-3 col-form-label pt-0">
            เลือกพรรคร่วมรัฐบาล
          </label>
          <div className="col-sm-9">
            {electionResult.getPotentialAllies(mainParty && mainParty.name).map(p => (
              <div
                key={p.party.name}
                className="custom-control custom-checkbox custom-control-inline"
              >
                <input
                  className="custom-control-input"
                  type="checkbox"
                  id={`ally-party-${p.party.name}`}
                  value={p.party.name}
                  checked={allyParties.has(p.party)}
                  onChange={() => {
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
                <label className="custom-control-label" htmlFor={`ally-party-${p.party.name}`}>
                  {p.party.name} ({p.seats})
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="" className="col-sm-3 col-form-label">
            จำนวนเสียงจากส.ว.
          </label>
          <div className="col-sm-9">
            <SeatInput
              value={senatorVotes}
              maxValue={TOTAL_SENATOR}
              onValueChange={newValue => {
                this.update({
                  senatorVotes: newValue,
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

GovernmentPanel.propTypes = propTypes;
GovernmentPanel.defaultProps = defaultProps;

export default GovernmentPanel;
