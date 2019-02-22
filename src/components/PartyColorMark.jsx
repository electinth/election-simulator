import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  radius: PropTypes.number,
};
const defaultProps = {
  className: '',
  color: '#ccc',
  radius: 4,
};

class PartyColorMark extends React.Component {
  render() {
    const { className, radius, color } = this.props;

    return (
      <svg className={className} width={radius * 2 + 2} height={radius * 2 + 2}>
        <circle cx={radius} cy={radius} r={radius} fill={color} />
      </svg>
    );
  }
}

PartyColorMark.propTypes = propTypes;
PartyColorMark.defaultProps = defaultProps;

export default PartyColorMark;
