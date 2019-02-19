/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import ElectionResult from '../models/ElectionResult';
import SeatInput from './SeatInput';
import { TOTAL_SENATOR } from '../models/rules';

const propTypes = {
  className: PropTypes.string,
  electionResult: PropTypes.instanceOf(ElectionResult).isRequired,
};
const defaultProps = {
  className: '',
};

class GovernmentPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allyPartyNames: new Set(),
      mainPartyName: null,
      senatorVotes: 250,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { mainPartyName } = this.state;
    const { electionResult } = nextProps;
    if (electionResult && !mainPartyName) {
      this.setState({ mainPartyName: electionResult.getTopNParties(1)[0].party.name });
    }
  }

  render() {
    const { className, electionResult } = this.props;
    const { mainPartyName, allyPartyNames, senatorVotes } = this.state;

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
                  checked={p.party.name === mainPartyName}
                  onClick={() => {
                    this.setState({
                      mainPartyName: p.party.name,
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
            {electionResult.getPotentialAllies(mainPartyName).map(p => (
              <div key={p.party.name} className="custom-control custom-checkbox custom-control-inline">
                <input
                  className="custom-control-input"
                  type="checkbox"
                  id={`ally-party-${p.party.name}`}
                  value={p.party.name}
                  checked={allyPartyNames.has(p.party.name)}
                  onClick={() => {
                    const newSet = new Set(allyPartyNames.values());
                    if (allyPartyNames.has(p.party.name)) {
                      newSet.delete(p.party.name);
                    } else {
                      newSet.add(p.party.name);
                    }
                    this.setState({
                      allyPartyNames: newSet,
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
            <SeatInput value={senatorVotes} maxValue={TOTAL_SENATOR} onValueChange={newValue => {
              this.setState({
                senatorVotes: newValue
              });
            }} />
          </div>
        </div>
      </div>
    );
  }
}

GovernmentPanel.propTypes = propTypes;
GovernmentPanel.defaultProps = defaultProps;

export default GovernmentPanel;
