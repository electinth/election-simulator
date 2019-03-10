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
import PartyColorMark from './components/PartyColorMark';
import Breadcrumb from './components/Breadcrumb';

const GovernmentVis = createComponent(RawGovernmentVis);

class App extends AppBase {
  constructor(props) {
    super(props);
    this.state.currentPage = 0;
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  getPageClass(index) {
    const { currentPage } = this.state;
    if (currentPage > index) {
      return 'page previous-page';
    } else if (currentPage < index) {
      return 'page next-page';
    }

    return 'page';
  }

  previousPage() {
    const { currentPage } = this.state;
    if (currentPage > 0) {
      this.setState({
        currentPage: currentPage - 1,
      });
    }
  }

  nextPage() {
    const { currentPage } = this.state;
    if (currentPage < 3) {
      this.setState({
        currentPage: currentPage + 1,
      });
    }
  }

  render() {
    const { electionResult, governmentConfig, currentPage } = this.state;

    let simulation;
    if (electionResult && governmentConfig) {
      simulation = new Simulation({
        electionResult,
        ...governmentConfig,
      });
    }

    const mainPartyResult = simulation.getMainPartyResult();

    return (
      <div className="frame-container">
        <article className="frame">
          <div className="content-pane">
            <section className={this.getPageClass(0)}>
              <ElectHeader />
              <div className="page-content">
              <h1>ทำนายผลเลือกตั้ง 2562</h1>
              <p>
                คำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย คำโปรยคำโปรย
                คำโปรยคำโปรย คำโปรยคำโปรย คำโปรย
              </p>
              </div>
            </section>
            <section className={this.getPageClass(1)}>
              <div className="page-content">
              <Breadcrumb page={1} />
              <h3>1. สัดส่วนส.ส.แต่ละพรรคในสภา</h3>
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
              </div>
            </section>
            <section className={this.getPageClass(2)}>
              <GovernmentFormulaTable
                simulation={simulation}
                electionResult={electionResult}
                governmentConfig={governmentConfig}
                onChange={value => {
                  this.setState({
                    governmentConfig: value,
                  });
                }}
              />
            </section>
            <section className={this.getPageClass(3)}>
                <div className="page-content">
                <Breadcrumb page={3} />
              <h3>3. สรุป</h3>
              <p>
                {simulation.printSummary()}
              </p>
              <div className="text-align-center">
                <SimulationLegend simulation={simulation} />
                <GovernmentVis data={simulation} />
              </div>
              <h4>พรรคหลัก</h4>
              <PartyColorMark radius={4} color={mainPartyResult.party.color} />
              {mainPartyResult.party.name}
              ({mainPartyResult.seats})
              {simulation.allyParties.size > 0 && (
                <React.Fragment>
                  <h4>พรรคร่วมรัฐบาล</h4>
                  {simulation.getAllyPartyResults().map(p => (
                    <React.Fragment>
                      <PartyColorMark radius={4} color={p.party.color} />
                      {p.party.name}
                      ({p.seats})
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )}
              </div>
            </section>
          </div>
          <nav className="nav-pane">
            {currentPage === 0 && (
              <button type="button" className="next-btn" onClick={this.nextPage}>
                เริ่ม <i className="fas fa-chevron-right" />
              </button>
            )}
            {currentPage === 1 && (
              <React.Fragment>
                <button type="button" className="" onClick={this.previousPage}>
                  <i className="fas fa-chevron-left" /> หน้าแรก
                </button>
                <button type="button" className="next-btn" onClick={this.nextPage}>
                  จัดตั้งรัฐบาล <i className="fas fa-chevron-right" />
                </button>
              </React.Fragment>
            )}
            {currentPage === 2 && (
              <React.Fragment>
                <button type="button" className="" onClick={this.previousPage}>
                  <i className="fas fa-chevron-left" /> ปรับสัดส่วน
                </button>
                <button type="button" className="next-btn" onClick={this.nextPage}>
                  สรุป <i className="fas fa-chevron-right" />
                </button>
              </React.Fragment>
            )}
            {currentPage === 3 && (
              <React.Fragment>
                <button type="button" className="" onClick={this.previousPage}>
                  <i className="fas fa-chevron-left" /> จัดตั้งรัฐบาล
                </button>
                <button type="button" className="next-btn">
                  แชร์ <i className="fas fa-share" />
                </button>
              </React.Fragment>
            )}
          </nav>
          <div className="credit-pane">
            Visualization by&nbsp;
            <a href="https://twitter.com/kristw" rel="noopener noreferrer" target="_blank">
              Krist Wongsuphasawat
            </a>
          </div>
        </article>
      </div>
    );
  }
}

export default hot(module)(App);
