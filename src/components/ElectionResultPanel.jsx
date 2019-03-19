/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { entries } from 'lodash';
import ElectionResult from '../models/ElectionResult';
import presets from '../data/electionResults';
import SeatInput from './SeatInput';
import { REMAINDER_PARTY_NAME } from '../models/Party';
import { TOTAL_REPRESENTATIVE } from '../models/rules';
import { DEFAULT_ELECTION_PRESET } from '../constants';
import ElectionResultTable from './ElectionResultTable';
import PartyColorMark from './PartyColorMark';

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
          <div className="col" style={{ textAlign: 'center' }}>
            <p>
              <small>
                (สามารถปรับตัวเลขได้ตามใจชอบ โดยกดปุ่มเพิ่ม/ลด หรือ กดที่ช่องตัวเลขแล้วพิมพ์)
              </small>
            </p>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 30 }}>
          {sortedParties.map(p => (
            <div
              key={p.party.name}
              className="col-lg-6 col-md-12 col-sm-6"
              style={{ textAlign: 'center', marginTop: 8, marginBottom: 8, fontSize: '0.9em' }}
            >
              <div>
                <label className="party-name">
                  <PartyColorMark radius={4} color={p.party.color} /> {p.party.name}
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
    const { className, preset, result } = this.props;
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
          <div className="col-md-auto">
            <div className="input-group" style={{ marginBottom: 10 }}>
              <select className="custom-select" onChange={this.handlePresetChange} value={preset}>
                {listOfPresets.map(rs => (
                  <option value={rs.key} key={rs.key}>
                    {rs.value.name}
                  </option>
                ))}
                <option value="CUSTOM">กำหนดเอง</option>
              </select>
            </div>
          </div>
          <div className="col">
            <button
              type="button"
              className={`btn btn-outline-secondary ${isEditing ? 'active' : ''}`}
              onClick={() => {
                this.setState({ isEditing: !isEditing });
              }}
            >
              <i className="fa fa-edit" /> แก้ไข
            </button>
          </div>
        </div>
        <p />
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
