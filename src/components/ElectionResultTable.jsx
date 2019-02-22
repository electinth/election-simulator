import React from 'react';
import PropTypes from 'prop-types';
import PartyWithResult from '../models/PartyWithResult';
import PartyColorMark from './PartyColorMark';

const propTypes = {
  className: PropTypes.string,
  sortedParties: PropTypes.arrayOf(PropTypes.instanceOf(PartyWithResult)),
};
const defaultProps = {
  className: '',
  sortedParties: [],
};

class ElectionResultTable extends React.Component {
  render() {
    const { className, sortedParties } = this.props;

    return (
      <table className={className}>
        <tbody>
          {sortedParties.map(p => (
            <tr key={p.party.name} className="table table-sm">
              <td>
                <PartyColorMark radius={4} color={p.party.color} />
              </td>
              <td className="party-name">{p.party.name}</td>
              <td style={{ textAlign: 'right' }}>{p.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

ElectionResultTable.propTypes = propTypes;
ElectionResultTable.defaultProps = defaultProps;

export default ElectionResultTable;
