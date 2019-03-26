import React from 'react';
import PropTypes from 'prop-types';
import PartyWithResult from '../models/PartyWithResult';
import { REMAINDER_PARTY_NAME } from '../models/Party';
import PartyColorMark from './PartyColorMark';
import './ElectionResultTable.css';

const propTypes = {
  sortedParties: PropTypes.arrayOf(PropTypes.instanceOf(PartyWithResult)),
};
const defaultProps = {
  sortedParties: [],
};

class ElectionResultTable extends React.Component {
  renderTable(parties, className) {
    return (
      <table className={`${className} election-result-table`}>
        <tbody>
          {parties.map(p => (
            <tr key={p.party.name} className="table table-sm">
              <td>
                <PartyColorMark radius={5} color={p.party.color} />
              </td>
              <td className="party-name">{p.party.name}</td>
              <td style={{ textAlign: 'right' }}>{p.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { sortedParties } = this.props;

    const partiesSortedBySeats = sortedParties.concat().sort((a, b) => {
      if (a.party.name === REMAINDER_PARTY_NAME) {
        return 1;
      } else if (b.party.name === REMAINDER_PARTY_NAME) {
        return -1;
      }

      return b.seats - a.seats;
    });
    const half = partiesSortedBySeats.length / 2;

    return (
      <div className="row">
        <div className="col">{this.renderTable(partiesSortedBySeats.slice(0, half))}</div>
        <div className="col">
          {this.renderTable(
            partiesSortedBySeats.slice(half, partiesSortedBySeats.length),
            'no-margin-right',
          )}
        </div>
      </div>
    );
  }
}

ElectionResultTable.propTypes = propTypes;
ElectionResultTable.defaultProps = defaultProps;

export default ElectionResultTable;
