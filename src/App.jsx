import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import ReactGA from 'react-ga';
import { hot } from 'react-hot-loader';
import { createComponent } from 'react-d3kit';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'react-share';
import ElectionResultPanel from './components/ElectionResultPanel';
import GovernmentFormulaTable from './components/GovernmentFormulaTable';
import RawGovernmentVis from './components/GovernmentArcVis';
import Simulation from './models/Simulation';
import SimulationLegend from './components/SimulationLegend';
import ElectHeader from './components/ElectHeader';
import Breadcrumb from './components/Breadcrumb';
import State from './models/State';

const GovernmentVis = createComponent(RawGovernmentVis);
const SHARE_ICON_SIZE = 32;
const ICON_BG_STYLE = { fill: 'rgba(255,255,255,0.4)' };

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { state: State.fromUrlParams(window.location.search.toString()) };
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleShare = this.handleShare.bind(this);
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
    const base = `page-${index}`;
    if (currentPage > index) {
      return `${base} page previous-page`;
    } else if (currentPage < index) {
      return `${base} page next-page`;
    }

    return `${base} page`;
  }

  createShareButtons(size, simulation) {
    const formula = simulation.toFormula();
    const title = `ทำนายผลเลือกตั้ง 2562: ${formula}`;
    const url = window.location.toString();

    return (
      <React.Fragment>
        <a
          href="#"
          className="SocialMediaShareButton"
          onClick={e => {
            e.preventDefault();
            this.handleShare(title);
            ReactGA.event({
              category: 'Share',
              action: 'Facebook',
              label: formula,
            });
          }}
        >
          <FacebookIcon size={size} round iconBgStyle={ICON_BG_STYLE} />
        </a>
        <TwitterShareButton title={title} url={url} hashtags={['electinth']}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              ReactGA.event({
                action: 'Twitter',
                category: 'Share',
                label: formula,
              });
            }}
          >
            <TwitterIcon size={size} round iconBgStyle={ICON_BG_STYLE} />
          </a>
        </TwitterShareButton>
        <LineShareButton title={title} url={url}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              ReactGA.event({
                action: 'Line',
                category: 'Share',
                label: formula,
              });
            }}
          >
            <LineIcon size={size} round iconBgStyle={ICON_BG_STYLE} />
          </a>
        </LineShareButton>
      </React.Fragment>
    );
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

  handleShare(title) {
    // eslint-disable-next-line no-undef
    FB.ui(
      {
        hashtag: '#electinth',
        href: window.location.toString(),
        method: 'share',
        quote: title,
      },
      function handleResponse() {},
    );
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

    return (
      <div className="frame-container">
        <article className="frame">
          <div className="content-pane">
            <section className={`first-page ${this.getPageClass(0)}`}>
              <ElectHeader />
              <div className="page-content">
                <h1>
                  ทำนายผล
                  <br />
                  เลือกตั้ง 2562
                </h1>
                <p className="introduction">
                  24 มีนาคม 62 คนไทยจะได้ใช้สิทธิเลือก &quot;ผู้แทน&quot; เข้าไปทำหน้าที่ในสภาฯ
                  <br />
                  พรรคไหนจะได้ส.ส. เท่าไหร่?
                  <br />
                  ใครจะอยู่พรรคร่วมรัฐบาลบ้าง?
                  <br />
                  รัฐบาลและนายกรัฐมนตรีคนต่อไปของประเทศไทยจะหน้าตาแบบไหน?
                </p>
                <p className="introduction">
                  ก่อนจะรู้ผลอย่างเป็นทางการ ลองมาทำนายผลการเลือกตั้งด้วยตัวคุณเอง
                </p>
                <p className="introduction large-display-only">
                  <button type="button" className="btn btn-red" onClick={this.handleNextPage}>
                    เริ่ม <i className="fas fa-chevron-right" />
                  </button>
                </p>
              </div>
            </section>
            <section className={this.getPageClass(1)}>
              <div className="page-content">
                <Breadcrumb page={1} />
                <h3>1. สัดส่วนส.ส.แต่ละพรรค</h3>
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
                <div className="share-floater float-right large-display-only">
                  <div className="btn btn-red">
                    แชร์ &nbsp;
                    {this.createShareButtons(24, simulation)}
                  </div>
                </div>
                <h3>3. สรุป</h3>
                <p style={{ height: 48, marginBottom: 0 }}>{simulation.printSummary()}</p>
                <div className="text-align-center">
                  <GovernmentVis data={simulation} />
                  <SimulationLegend simulation={simulation} />
                </div>
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
                <button type="button" className="next-btn">
                  แชร์ &nbsp;
                  {this.createShareButtons(30, simulation)}
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
