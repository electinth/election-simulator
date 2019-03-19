import React from 'react';
import PropTypes from 'prop-types';
import './Breadcrumb.css';

const propTypes = {
  className: PropTypes.string,
  padding: PropTypes.number,
  radius: PropTypes.number,
};
const defaultProps = {
  className: '',
  padding: 4,
  radius: 6,
};

class Breadcrumb extends React.Component {
  renderCircle(active) {
    const { padding, radius } = this.props;

    const w = radius * 2 + padding;

    return active ? (
      <svg width={w} height={w}>
        <circle cx={w / 2} cy={w / 2} r={radius} fill="#ccc" />
      </svg>
    ) : (
      <svg width={w} height={w}>
        <circle cx={w / 2} cy={w / 2} r={radius - 1} fill="none" stroke="#ccc" />
      </svg>
    );
  }

  render() {
    const { className, page, radius, padding } = this.props;

    const w = radius * 2 + padding;

    return (
      <div className="k-breadcrumb">
        {this.renderCircle(page === 1)}
        <svg width="50" height={w}>
          <line x2="50" y1={w / 2} y2={w / 2} stroke="#ccc" strokeDasharray="2 2" />
        </svg>
        {this.renderCircle(page === 2)}
        <svg width="50" height={w}>
          <line x2="50" y1={w / 2} y2={w / 2} stroke="#ccc" strokeDasharray="2 2" />
        </svg>
        {this.renderCircle(page === 3)}
      </div>
    );
  }
}

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
