/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { keyBy } from 'lodash';
import ElectionResult from '../models/ElectionResult';
import presets from '../data/electionResults';
import SeatInput from './SeatInput';
import { REMAINDER_PARTY_NAME } from '../models/Party';
import { TOTAL_REPRESENTATIVE } from '../models/rules';
import { DEFAULT_ELECTION_PRESET_INDEX } from '../constants';
import ElectionResultTable from './ElectionResultTable';
import PartyColorMark from './PartyColorMark';

const presetLookup = keyBy(presets, p => p.key);

const propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  result: PropTypes.instanceOf(ElectionResult).isRequired,
};
const defaultProps = {
  className: '',
  onChange() {},
};

class ElectionResultPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    const preset = presets[DEFAULT_ELECTION_PRESET_INDEX].key;
    this.state = { isEditing: false, preset };
    this.handlePresetChange = this.handlePresetChange.bind(this);
  }

  handlePresetChange(ev) {
    const { result } = this.state;
    const { onChange } = this.props;
    const preset = ev.target.value;
    const newResult =
      preset === 'CUSTOM' ? result.clone() : new ElectionResult(presetLookup[preset].result);
    this.setState({
      preset,
      result: newResult,
    });
    onChange(newResult);
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
                    this.setState({
                      preset: 'CUSTOM',
                      result: newResult,
                    });
                    onChange(newResult);
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
    const { className, result } = this.props;
    const { preset, isEditing } = this.state;

    const remainderParty = result.partyWithResults.filter(
      p => p.party.name === REMAINDER_PARTY_NAME,
    );

    const sortedParties = result.partyWithResults
      .filter(p => p.party.name !== REMAINDER_PARTY_NAME)
      .sort((a, b) => a.party.name.localeCompare(b.party.name))
      .concat(remainderParty);

    return (
      <div className={className}>
        <div className="row">
          <div className="col-md-auto">
            <div className="input-group" style={{ marginBottom: 10 }}>
              <div className="input-group-prepend">
                <label className="input-group-text">ใช้ตัวเลขจาก</label>
              </div>
              <select className="custom-select" onChange={this.handlePresetChange} value={preset}>
                {presets.map(rs => (
                  <option value={rs.key} key={rs.key}>
                    {rs.name}
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
