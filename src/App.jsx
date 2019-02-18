import './style-header.css';
import './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';

const propTypes = {
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

class App extends React.Component {
  render() {
    const { className } = this.props;

    return <div className={className}>under construction</div>;
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default hot(module)(App);
