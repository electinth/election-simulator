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
    this.state = { preset };
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

  render() {
    const { className, onChange, result } = this.props;
    const { preset } = this.state;

    const remainderParty = result.partyWithResults.filter(
      p => p.party.name === REMAINDER_PARTY_NAME,
    );

    const sortedParties = result.partyWithResults
      .filter(p => p.party.name !== REMAINDER_PARTY_NAME)
      .sort((a, b) => a.party.name.localeCompare(b.party.name))
      .concat(remainderParty);

    return (
      <div className={className}>
        <div className="input-group">
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
        <p>
          <small>
            (สามารถปรับตัวเลขได้ตามใจชอบ โดยกดปุ่มเพิ่ม/ลด หรือ กดที่ช่องตัวเลขแล้วพิมพ์)
          </small>
        </p>
        <p />
        <div className="container">
          <div className="row">
            {sortedParties.map(p => (
              <div key={p.party.name} className="col-lg-3 col-md-4 col-sm-6" style={{ textAlign: 'center', marginTop: 8, marginBottom: 8, fontSize: '0.9em' }}>
                  <div>
                  <label
                    className="party-name"

                  >
                    {p.party.name}
                  </label>
                  </div>
                  <div style={{display: 'inline-block'}}>
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
        </div>
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
