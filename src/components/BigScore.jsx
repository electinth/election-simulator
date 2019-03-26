/* eslint-disable sort-keys */
import React from 'react';
import PropTypes from 'prop-types';
import './BigScore.css';

const propTypes = {
  header: PropTypes.string,
  score: PropTypes.number,
  pass: PropTypes.boolean,
  passText: PropTypes.string,
  failText: PropTypes.string,
};

const defaultProps = {
  header: '',
  score: 0,
  pass: false,
  passText: '',
  failText: '',
};

export default function BigScore({ header, score, pass, passText, failText }) {
  return (
    <div className="big-score">
      {header}
      <div className="big-number">
        <i
          className={`far ${
            pass ? 'fa-check-circle fa-icon-green' : 'fa-times-circle fa-icon-red'
          }`}
        />
        &nbsp;{score}
      </div>
      <div>{pass ? passText : failText}</div>
    </div>
  );
}

BigScore.propTypes = propTypes;
BigScore.defaultProps = defaultProps;
