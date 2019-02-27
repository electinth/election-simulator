import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import { createComponent } from 'react-d3kit';
import ElectionResultPanel from './components/ElectionResultPanel';
import GovernmentPanel from './components/GovernmentPanel2';
import RawGovernmentVis from './components/GovernmentVis';
import Simulation from './models/Simulation';
import ElectionResult from './models/ElectionResult';
import electionResultPresets from './data/electionResults';
import { DEFAULT_ELECTION_PRESET_INDEX } from './constants';
import PartyColorMark from './components/PartyColorMark';

const GovernmentVis = createComponent(RawGovernmentVis);

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    const electionResult = new ElectionResult(
      electionResultPresets[DEFAULT_ELECTION_PRESET_INDEX].result,
    );

    this.state = {
      electionResult,
      governmentConfig: {
        allyParties: new Set(),
        mainParty:
          electionResult && electionResult.partyWithResults.length > 0
            ? electionResult.getTopNParties(1)[0].party
            : null,
        senatorVotes: 0,
      },
    };
  }

  renderSimulationLegend(simulation) {
    const { mainParty, senatorVotes, allyParties } = simulation;

    return (
      <div style={{ textAlign: 'center' }}>
        <small className="party-name">
          {senatorVotes > 0 && (
            <span>
              <PartyColorMark shape="round-rect" color={mainParty.color} /> ส.ว. &nbsp;
            </span>
          )}
          <PartyColorMark color={mainParty.color} /> {mainParty.name}
          {allyParties && allyParties.size > 0 && (
            <React.Fragment>
              &nbsp; <PartyColorMark shape="hollow-circle" color={mainParty.color} /> พรรคร่วมรัฐบาล
              ({allyParties.size} พรรค)
            </React.Fragment>
          )}
        </small>
      </div>
    );
  }

  renderSummary(simulation) {
    if (simulation.canElectPrimeMinister() && simulation.winCouncil()) {
      return 'ได้จัดตั้งรัฐบาล!';
    } else if (simulation.canElectPrimeMinister()) {
      return `มีเสียงพอเลือกนายกฯ แต่ไม่ได้เสียงส่วนใหญ่ในสภา (ขาดอีก ${simulation.seatsToWinCouncil()})`;
    } else if (simulation.winCouncil()) {
      return `ได้เสียงข้างมากในสภา แต่ไม่ได้เลือกนายกฯ (ขาดอีก ${simulation.seatsToElectPrimeMinister()})!`;
    }

    return `ได้เสียงไม่พอ (ขาดอีก ${simulation.seatsToElectPrimeMinister()} เพื่อเลือกนายกฯ และ ขาดอีก ${simulation.seatsToWinCouncil()} เพื่อให้ได้เสียงข้างมากในสภาฯ)`;
  }

  render() {
    const { electionResult, governmentConfig } = this.state;

    let simulation;
    if (electionResult && governmentConfig) {
      simulation = new Simulation({
        electionResult,
        ...governmentConfig,
      });
    }

    return (
      <React.Fragment>
        <section className="container">
          <header className="row">
            <div className="col">
              <h3>ขั้นที่ 1. สมมติว่าแต่ละพรรคได้ส.ส.เท่านี้</h3>
            </div>
          </header>
          <div className="row">
            <div className="col">
              <ElectionResultPanel
                result={electionResult}
                onChange={value => {
                  this.setState({ electionResult: value });
                }}
              />
            </div>
          </div>
        </section>
        {!electionResult.isOverflow() && (
          <section className="container">
            <div className="row">
              <div className="col">
                <h3>ขั้นที่ 2. ลองตั้งรัฐบาล</h3>
                <p />
                <GovernmentPanel
                  electionResult={electionResult}
                  governmentConfig={governmentConfig}
                  onChange={value => {
                    this.setState({
                      governmentConfig: value,
                    });
                  }}
                />
              </div>
              <div className="col">
                <div className="row">
                  <div className="col" />
                  <div className="col-md-auto">
                    <div className="result-card">
                      <div className="row">
                        <div className="col">
                          เสียงส.ส. + ส.ว.
                          <div className={`big-number ${simulation.canElectPrimeMinister() ? 'fa-icon-green' : 'fa-icon-red'}`}>
                            {simulation.totalSeats + simulation.senatorVotes}&nbsp;
                            <i
                              className={`far ${
                                simulation.canElectPrimeMinister()
                                  ? 'fa-check-circle fa-icon-green'
                                  : 'fa-times-circle fa-icon-red'
                              }`}
                            />
                          </div>
                          <div>
                            {simulation.canElectPrimeMinister() ? (
                              'ได้เลือกนายก!'
                            ) : (
                              <span>
                                ไม่ได้เลือกนายก
                                <br />
                                <small>
                                (ขาด {simulation.seatsToElectPrimeMinister()} เสียง)
                                </small>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col">
                          เสียงส.ส.
                          <div className={`big-number ${simulation.winCouncil() ? 'fa-icon-green' : 'fa-icon-red'}`}>
                            {simulation.totalSeats}&nbsp;
                            <i
                              className={`far ${
                                simulation.winCouncil()
                                  ? 'fa-check-circle fa-icon-green'
                                  : 'fa-times-circle fa-icon-red'
                              }`}
                            />
                          </div>
                          <div>
                            {simulation.winCouncil() ? (
                              'ทำงานได้!'
                            ) : (
                              <span>
                                ทำงานไม่ได้
                                <br />
                                <small>
                                (ขาด {simulation.seatsToWinCouncil()} เสียง)
                                </small>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <br />
                      <GovernmentVis data={simulation} />
                      {this.renderSimulationLegend(simulation)}
                    </div>
                  </div>
                  <div className="col" />
                </div>
              </div>
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
