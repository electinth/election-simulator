import React from 'react';
import PropTypes from 'prop-types';
import PartyWithResult from '../models/PartyWithResult';

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

    const R = 4;

    return (
      <table className={className}>
        <tbody>
          {sortedParties.map(p => (
            <tr key={p.party.name} className="table table-sm">
              <td>
                <svg width={R * 2 + 2} height={R * 2 + 2}>
                  <circle cx={R} cy={R} r={R} fill={p.party.color} />
                </svg>
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
