import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import { createComponent } from 'react-d3kit';
// import AppBase from './AppBase';
import ElectionResultPanel from './components/ElectionResultPanel';
import GovernmentFormulaTable from './components/GovernmentFormulaTable';
import RawGovernmentVis from './components/GovernmentArcVis';
import Simulation from './models/Simulation';
import SimulationLegend from './components/SimulationLegend';
import ElectHeader from './components/ElectHeader';
import PartyColorMark from './components/PartyColorMark';
import Breadcrumb from './components/Breadcrumb';
import State from './models/State';

const GovernmentVis = createComponent(RawGovernmentVis);

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { state: State.fromUrlParams(window.location.search.toString()) };
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  componentDidMount() {
    this.updateUrl();
  }

  componentDidUpdate() {
    this.updateUrl();
  }

  getPageClass(index) {
    const { state } = this.state;
    const { currentPage } = state;
    if (currentPage > index) {
      return 'page previous-page';
    } else if (currentPage < index) {
      return 'page next-page';
    }

    return 'page';
  }

  updateUrl() {
    if (window.history && window.history.pushState) {
      const { state } = this.state;
      const prevParams = `${window.location.search}`;
      const newParams = `?${state.toUrlParams()}`;

      if (prevParams !== newParams) {
        const url = `${window.location.toString().split('?')[0]}${newParams}`;
        window.history.pushState({}, null, url);
      }
    }
  }

  handlePrevPage() {
    const { state } = this.state;
    const { currentPage } = state;
    if (currentPage > 0) {
      this.setState({
        state: state.set({
          currentPage: currentPage - 1,
        }),
      });
    }
  }

  handleNextPage() {
    const { state } = this.state;
    const { currentPage } = state;
    if (currentPage < 3) {
      this.setState({
        state: state.set({
          currentPage: currentPage + 1,
        }),
      });
    }
  }

  render() {
    const { state } = this.state;
    const { electionResultPreset, electionResult, governmentConfig, currentPage } = state;

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
                <h1>
                  ทำนายผล
                  <br />
                  เลือกตั้ง 2562
                </h1>
                <p className="introduction">
                  24 มีนาคม 62 คนไทยจะได้ใช้สิทธิเลือก ‘ผู้แทน’ เข้าไปทำหน้าที่ในสภาฯ
                  พรรคไหนจะได้ส.ส. เท่าไหร่? ใครจะอยู่พรรคร่วมรัฐบาลบ้าง?
                  รัฐบาลและนายกรัฐมนตรีคนต่อไปของประเทศไทยจะหน้าตาแบบไหน?
                </p>
                <p className="introduction">
                  ก่อนจะรู้ผลอย่างเป็นทางการ ลองมาทำนายผลการเลือกตั้งด้วยตัวคุณเอง
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
                      preset={electionResultPreset}
                      result={electionResult}
                      onChange={({ preset, result }) => {
                        this.setState({
                          state: state.set({
                            electionResult: result,
                            electionResultPreset: preset,
                          }),
                        });
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
                    state: state.set({
                      governmentConfig: value,
                    }),
                  });
                }}
              />
            </section>
            <section className={this.getPageClass(3)}>
              <div className="page-content">
                <Breadcrumb page={3} />
                <h3>3. สรุป</h3>
                <p>{simulation.printSummary()}</p>
                <div className="text-align-center">
                  <SimulationLegend simulation={simulation} />
                  <GovernmentVis data={simulation} />
                </div>
                <h4>พรรคหลัก</h4>
                <PartyColorMark radius={5} color={mainPartyResult.party.color} />
                &nbsp;
                {mainPartyResult.party.name} ({mainPartyResult.seats})
                {simulation.allyParties.size > 0 && (
                  <React.Fragment>
                    <h4>พรรคร่วมรัฐบาล</h4>
                    {simulation.getAllyPartyResults().map(p => (
                      <div
                        key={p.party.name}
                        style={{ display: 'inline-block', marginRight: '8px' }}
                      >
                        <PartyColorMark radius={5} color={p.party.color} />
                        &nbsp;
                        {p.party.name} ({p.seats})
                      </div>
                    ))}
                  </React.Fragment>
                )}
              </div>
            </section>
          </div>
          <nav className="nav-pane">
            {currentPage === 0 && (
              <button type="button" className="next-btn" onClick={this.handleNextPage}>
                เริ่ม <i className="fas fa-chevron-right" />
              </button>
            )}
            {currentPage === 1 && (
              <React.Fragment>
                <button type="button" className="" onClick={this.handlePrevPage}>
                  <i className="fas fa-chevron-left" /> หน้าแรก
                </button>
                <button type="button" className="next-btn" onClick={this.handleNextPage}>
                  จัดตั้งรัฐบาล <i className="fas fa-chevron-right" />
                </button>
              </React.Fragment>
            )}
            {currentPage === 2 && (
              <React.Fragment>
                <button type="button" className="" onClick={this.handlePrevPage}>
                  <i className="fas fa-chevron-left" /> ปรับสัดส่วน
                </button>
                <button type="button" className="next-btn" onClick={this.handleNextPage}>
                  สรุป <i className="fas fa-chevron-right" />
                </button>
              </React.Fragment>
            )}
            {currentPage === 3 && (
              <React.Fragment>
                <button type="button" className="" onClick={this.handlePrevPage}>
                  <i className="fas fa-chevron-left" /> จัดตั้งรัฐบาล
                </button>
                <button
                  type="button"
                  className="next-btn"
                  onClick={() => {
                    FB.ui(
                      {
                        href: window.location.toString(),
                        method: 'share',
                      },
                      function(response) {},
                    );
                  }}
                >
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
