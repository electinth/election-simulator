import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  padding: PropTypes.number,
  radius: PropTypes.number,
  shape: PropTypes.string,
};
const defaultProps = {
  className: '',
  color: '#ccc',
  padding: 1,
  radius: 4,
  shape: 'circle',
};

class PartyColorMark extends React.Component {
  renderShape() {
    const { shape, radius, color } = this.props;

    if (shape === 'hollow-circle') {
      return <circle cx={radius} cy={radius} r={radius - 1} stroke={color} fill="none" />;
    } else if (shape === 'round-rect') {
      return (
        <rect x="2" y="2" rx="2" width={(radius - 1) * 2} height={(radius - 1) * 2} fill={color} />
      );
    } else if (shape === 'diamond') {
      return (
        <rect x={-radius+1} y={-radius+1} rx="2" width={(radius - 1) * 2} height={(radius - 1) * 2} fill={color} transform={`translate(${radius},${radius})rotate(45)`} />
      );
    } else if (shape === 'cross') {
      const shortRadius = radius - 1;
      return (
        <path transform={`translate(${radius},${radius})`} d={`M${-shortRadius},${-shortRadius} L${shortRadius},${shortRadius} M${-shortRadius},${shortRadius} L${shortRadius},${-shortRadius}`} stroke={color} strokeWidth={1.5} />
      );
    }

    return <circle cx={radius} cy={radius} r={radius} fill={color} />;
  }

  render() {
    const { className, padding, radius } = this.props;

    return (
      <svg className={className} width={radius * 2 + padding * 2} height={radius * 2 + padding * 2}>
        {this.renderShape()}
      </svg>
    );
  }
}

PartyColorMark.propTypes = propTypes;
PartyColorMark.defaultProps = defaultProps;

export default PartyColorMark;
