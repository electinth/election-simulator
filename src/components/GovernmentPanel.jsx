/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for, no-magic-numbers */

import React from 'react';
import PropTypes from 'prop-types';
import ElectionResult from '../models/ElectionResult';
import SeatInput from './SeatInput';
import { TOTAL_SENATOR } from '../models/rules';

const R = 4;

const propTypes = {
  className: PropTypes.string,
  electionResult: PropTypes.instanceOf(ElectionResult).isRequired,
  onChange: PropTypes.func,
};
const defaultProps = {
  className: '',
  onChange() {},
};

const ALLY_PARTY_BADGE_STYLE = { marginBottom: 4, marginRight: 4 };

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
        <div className="form-group">
          <div>
            <label htmlFor=""> เลือกพรรคหลัก</label>
          </div>
          <div className="btn-group">
            {electionResult.getTopNParties().map(p => (
              <button
                type="button"
                key={p.party.name}
                className={`btn btn-outline-secondary ${p.party === mainParty ? 'active' : ''}`}
                onClick={() => {
                  this.update({
                    mainParty: p.party,
                  });
                }}
              >
                <svg width={R * 2 + 2} height={R * 2 + 2}>
                  <circle cx={R} cy={R} r={R} fill={p.party.color} />
                </svg>
                &nbsp;
                {p.party.name}
                &nbsp;
                <span className="badge badge-light">{p.seats}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <div>
            <label>เลือกพรรคร่วมรัฐบาล</label>
          </div>
          {electionResult.getPotentialAllies(mainParty && mainParty.name).map(p => (
            <button
              type="button"
              key={p.party.name}
              className={`btn btn-sm btn-outline-secondary badge-pill ${allyParties.has(p.party) ? 'active' : ''}`}
              style={ALLY_PARTY_BADGE_STYLE}
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
            >
              <svg width={R * 2 + 2} height={R * 2 + 2}>
                <circle cx={R} cy={R} r={R} fill={p.party.color} />
              </svg>
              &nbsp;
              {p.party.name}&nbsp;
              <span className="badge badge-light">{p.seats}</span>
            </button>
          ))}
        </div>
        <div className="form-group">
          <div>
            <label htmlFor="">จำนวนเสียงจากส.ว.</label>
          </div>
          <SeatInput
            value={senatorVotes}
            maxValue={TOTAL_SENATOR}
            steppers={[-50, -1, 1, 50]}
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
