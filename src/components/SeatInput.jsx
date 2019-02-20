/* eslint-disable no-magic-numbers */

import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import './SeatInput.css';
import { TOTAL_REPRESENTATIVE } from '../models/rules';

const propTypes = {
  className: PropTypes.string,
  maxValue: PropTypes.number,
  onValueChange: PropTypes.func,
  steppers: PropTypes.arrayOf(PropTypes.number),
  value: PropTypes.number,
};
const defaultProps = {
  className: '',
  maxValue: TOTAL_REPRESENTATIVE,
  onValueChange() {},
  steppers: [1, 10],
  value: 0,
};

const TEXT_INPUT_STYLE = {
  borderLeft: 'none',
  borderRadius: 0,
  borderRight: 'none',
  borderTop: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  height: '28px',
  paddingBottom: 0,
  paddingTop: 0,
  textAlign: 'right',
};
const BUTTON_STYLE = {
  // border: 'none',
  borderRadius: '4px',
  // color: '#fff',
  fontSize: '0.75em',
  marginLeft: 2,
  marginRight: 2,
  minWidth: '28px',
};

class SeatInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleTextChange = debounce(this.handleTextChange.bind(this), 100);
  }

  boundValue(value) {
    const { maxValue } = this.props;

    return Math.min(Math.max(0, value), maxValue);
  }

  handleTextChange(value) {
    const newValue = Number(value);
    const { onValueChange } = this.props;
    onValueChange(this.boundValue(newValue));
  }

  handleButtonClick(diff) {
    const { onValueChange, value } = this.props;
    onValueChange(this.boundValue(value + diff));
  }

  render() {
    const { className, value, steppers } = this.props;

    return (
      <div className={className}>
        <div className="input-group seat-input">
          <div className="input-group-append">
            {steppers
              .concat()
              .reverse()
              .map(step => step * -1)
              .map(step => (
                <button
                  key={step}
                  className="btn btn-sm btn-light"
                  type="button"
                  style={BUTTON_STYLE}
                  onClick={() => this.handleButtonClick(step)}
                >
                  <i className="fas fa-minus fa-sm" /> {step < -1 ? Math.abs(step) : ''}
                </button>
              ))}
          </div>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder=""
            aria-label="Example text with button addon"
            aria-describedby="button-addon1"
            value={value}
            style={TEXT_INPUT_STYLE}
            onChange={ev => {
              this.handleTextChange(ev.target.value);
            }}
          />
          <div className="input-group-append">
            {steppers.map(step => (
              <button
                key={step}
                className="btn btn-sm btn-light"
                type="button"
                style={BUTTON_STYLE}
                onClick={() => this.handleButtonClick(step)}
              >
                <i className="fas fa-plus fa-sm" /> {step > 1 ? step : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

SeatInput.propTypes = propTypes;
SeatInput.defaultProps = defaultProps;

export default SeatInput;
