/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { keyBy } from 'lodash';
import ElectionResult from '../models/ElectionResult';
import presets from '../data/electionResults';
import SeatInput from './SeatInput';
import { REMAINDER_PARTY_NAME } from '../models/Party';
import { TOTAL_REPRESENTATIVE } from '../models/rules';

const presetLookup = keyBy(presets, p => p.key);

const propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
};
const defaultProps = {
  className: '',
  onChange() {},
};

class ElectionResultPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    const preset = presets[0].key;
    this.state = {
      preset,
      result: new ElectionResult(presetLookup[preset].result),
    };
    this.handlePresetChange = this.handlePresetChange.bind(this);
  }

  componentDidMount() {
    const { result } = this.state;
    const { onChange } = this.props;
    onChange(result);
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
    const { className, onChange } = this.props;
    const { preset, result } = this.state;

    const half =
      result.totalSeats < TOTAL_REPRESENTATIVE
        ? Math.floor(result.partyWithResults.length / 2)
        : Math.ceil(result.partyWithResults.length / 2);
    const sortedParties = result.partyWithResults.concat().sort((a, b) => {
      if (a.party.name === REMAINDER_PARTY_NAME) {
        return 1;
      } else if (b.party.name === REMAINDER_PARTY_NAME) {
        return -1;
      }

      return a.party.name.localeCompare(b.party.name);
    });
    const halves = [sortedParties.slice(0, half), sortedParties.slice(half)];

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
            {halves.map(parties => (
              <div className="col" key={parties[0].party.name}>
                <div className="form">
                  {parties.map(p => (
                    <div key={p.party.name} className="form-group row">
                      <label
                        className="col col-form-label col-form-label-sm"
                        style={{ textAlign: 'right' }}
                      >
                        {p.party.name}
                      </label>
                      <div className="col-md-auto">
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
