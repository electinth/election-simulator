/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { entries } from 'lodash';
import ElectionResult from '../models/ElectionResult';
import presets from '../data/electionResults';
import SeatInput from './SeatInput';
import { REMAINDER_PARTY_NAME } from '../models/Party';
import { TOTAL_REPRESENTATIVE } from '../models/rules';
import ElectionResultTable from './ElectionResultTable';
import PartyColorMark from './PartyColorMark';
import './ElectionResultPanel.css';
import { randomizeResults } from '../models/factory';

const listOfPresets = entries(presets).map(([key, value]) => ({ key, value }));

const propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  preset: PropTypes.string.isRequired,
  result: PropTypes.instanceOf(ElectionResult).isRequired,
};
const defaultProps = {
  className: '',
  onChange() {},
};

class ElectionResultPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { isEditing: false };
    this.handlePresetChange = this.handlePresetChange.bind(this);
  }

  handlePresetChange(ev) {
    const { result } = this.props;
    const { onChange } = this.props;
    const preset = ev.target.value;
    const newResult =
      preset === 'CUSTOM' ? result.clone() : new ElectionResult(presets[preset].result);
    onChange({ preset, result: newResult });
  }

  renderEditor(sortedParties) {
    const { onChange, result } = this.props;
    const { isEditing } = this.state;

    if (!isEditing) return null;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <p className="helper-text">(กดปุ่ม +/- หรือ กดที่ช่องตัวเลขแล้วพิมพ์)</p>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 30 }}>
          {sortedParties.map(p => (
            <div
              key={p.party.name}
              className="col-lg-12 col-md-12 col-sm-6"
              style={{ marginBottom: 8, marginTop: 8 }}
            >
              <div>
                <label className="party-name">
                  <PartyColorMark radius={5} color={p.party.color} /> {p.party.name}
                </label>
              </div>
              <div style={{ display: 'inline-block' }}>
                <SeatInput
                  value={p.seats}
                  onValueChange={value => {
                    const newResult = result.cloneAndUpdateSeats(p.party.name, value);
                    const partialState = {
                      preset: 'CUSTOM',
                      result: newResult,
                    };
                    this.setState(partialState);
                    onChange(partialState);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { className, preset, result, onChange } = this.props;
    const { isEditing } = this.state;

    const remainderParty = result.partyWithResults.filter(
      p => p.party.name === REMAINDER_PARTY_NAME,
    );

    const sortedParties = result.partyWithResults
      .filter(p => p.party.name !== REMAINDER_PARTY_NAME)
      .sort((a, b) => a.party.name.localeCompare(b.party.name))
      .concat(remainderParty);

    return (
      <div className={className}>
        ใช้ตัวเลขจาก
        <div className="row">
          <div className="col-sm-auto">
            <div className="input-group select-box">
              <select className="custom-select" onChange={this.handlePresetChange} value={preset}>
                {listOfPresets.map(rs => (
                  <option value={rs.key} key={rs.key}>
                    {rs.value.name}
                  </option>
                ))}
                <option value="CUSTOM">กำหนดเอง</option>
              </select>
              <button
                type="button"
                className={`btn btn-outline-secondary preset-btn ${isEditing ? 'active' : ''}`}
                onClick={() => {
                  this.setState({ isEditing: !isEditing });
                }}
              >
                {isEditing ? 'หยุดแก้ไข' : 'แก้ไข'}
              </button>
              &nbsp;
              <button
                type="button"
                className={`btn btn-outline-secondary preset-btn ${isEditing ? 'active' : ''}`}
                onClick={() => {
                  const newResult = new ElectionResult(randomizeResults());
                  const partialState = {
                    preset: 'CUSTOM',
                    result: newResult,
                  };
                  this.setState(partialState);
                  onChange(partialState);
                }}
              >
                มั่ว!
              </button>
            </div>
          </div>
          <div className="col" />
        </div>
        {!isEditing && (
          <div className="row">
            <div className="col">
              <ElectionResultTable sortedParties={sortedParties} />
            </div>
          </div>
        )}
        {this.renderEditor(sortedParties)}
        {result.isOverflow() && (
          <h3 style={{ marginTop: '20px', padding: '20px 0', textAlign: 'center' }}>
            เกิน! ส.ส.มีได้ {TOTAL_REPRESENTATIVE} คน ตอนนี้มี {result.totalSeats}
          </h3>
        )}
      </div>
    );
  }
}

ElectionResultPanel.propTypes = propTypes;
ElectionResultPanel.defaultProps = defaultProps;

export default ElectionResultPanel;
