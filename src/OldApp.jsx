import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import { createComponent } from 'react-d3kit';
import AppBase from './AppBase';
import ElectionResultPanel from './components/ElectionResultPanel';
import GovernmentFormulaTable from './components/GovernmentFormulaTable';
import RawGovernmentVis from './components/GovernmentVis';
import Simulation from './models/Simulation';
import SimulationLegend from './components/SimulationLegend';
import ElectHeader from './components/ElectHeader';

const GovernmentVis = createComponent(RawGovernmentVis);

class App extends AppBase {
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
        <ElectHeader />
        <article>
          <header>
            <h1>ทำนายผลเลือกตั้ง 2562</h1>
          </header>
          <section className="container introduction">
            <div className="row">
              <div className="col">
                <p>
                  คำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย
                  คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรย
                </p>
              </div>
            </div>
          </section>
          {!electionResult.isOverflow() && (
            <section className="container">
              <div className="row">
                <div className="col">
                  <h3>ขั้นที่ 1. สมมติว่าแต่ละพรรคได้ส.ส.เท่านี้</h3>
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
                  <h3>ขั้นที่ 2. ลองตั้งรัฐบาล</h3>
                  <p />
                  <GovernmentFormulaTable
                    electionResult={electionResult}
                    governmentConfig={governmentConfig}
                    onChange={value => {
                      this.setState({
                        governmentConfig: value,
                      });
                    }}
                  />
                </div>
                <div className="col-lg-5 col-md-6">
                  <div className="row">
                    <div className="col" />
                    <div className="col-md-auto">
                      <div className="result-card">
                        <div className="row">
                          <div className="col">
                            เสียงส.ส. + ส.ว.
                            <div
                              className={`big-number ${
                                simulation.canElectPrimeMinister() ? 'fa-icon-green' : 'fa-icon-red'
                              }`}
                            >
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
                            <div
                              className={`big-number ${
                                simulation.winCouncil() ? 'fa-icon-green' : 'fa-icon-red'
                              }`}
                            >
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
                                'คุมสภาผู้แทนฯได้!'
                              ) : (
                                <span>
                                  คุมสภาผู้แทนฯไม่ได้
                                  <br />
                                  <small>(ขาด {simulation.seatsToWinCouncil()} เสียง)</small>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <br />
                        <GovernmentVis data={simulation} />
                        <SimulationLegend simulation={simulation} />
                      </div>
                    </div>
                    <div className="col" />
                  </div>
                </div>
              </div>
            </section>
          )}
          <footer>
            <section id="footnote">
              <b>หมายเหตุ:</b> ยังทำไม่เสร็จ
            </section>
            <section id="credits">
              Visualization by
              <a href="https://twitter.com/kristw" rel="noopener noreferrer" target="_blank">
                Krist Wongsuphasawat
              </a>
            </section>
          </footer>
        </article>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
