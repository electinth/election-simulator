import React from 'react';
import PropTypes from 'prop-types';
import './Breadcrumb.css';

const propTypes = {
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

class Breadcrumb extends React.Component {
  renderCircle(active) {
    return active ? (
      <svg width="30" height="30">
        <circle cx="15" cy="15" r="10" fill="#ccc" />
      </svg>
    ) : (
      <svg width="30" height="30">
        <circle cx="15" cy="15" r="9" fill="none" stroke="#ccc" />
      </svg>
    );
  }

  render() {
    const { className, page } = this.props;

    return (
      <div className="k-breadcrumb">
        {this.renderCircle(page === 1)}
        <svg width="50" height="30">
          <line x2="50" y1="15" y2="15" stroke="#ccc" strokeDasharray="2 2" />
        </svg>
        {this.renderCircle(page === 2)}
        <svg width="50" height="30">
          <line x2="50" y1="15" y2="15" stroke="#ccc" strokeDasharray="2 2" />
        </svg>
        {this.renderCircle(page === 3)}
      </div>
    );
  }
}

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
