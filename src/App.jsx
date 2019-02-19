import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import ElectionResultPanel from './components/ElectionResultPanel';
import GovernmentPanel from './components/GovernmentPanel';
import Simulation from './models/Simulation';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      electionResult: null,
      governmentConfig: null,
    };
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
          <header className="col">
            <h3>ขั้นที่ 1. สมมติว่าแต่ละพรรคได้ส.ส.เท่านี้</h3>
          </header>
          <div className="col">
            <ElectionResultPanel
              onChange={value => {
                this.setState({ electionResult: value });
              }}
            />
          </div>
        </section>
        <section className="container">
          <header className="col">
            <h3>ขั้นที่ 2. ลองจัดตั้งรัฐบาล</h3>
            <p>
              หลังจากการเลือกตั้งและนับคะแนน ก็ถึงเวลาที่บรรดาพรรคการเมืองจะจับมือกัน
              เพื่อเลือกนายกรัฐมนตรีและจัดตั้งรัฐบาล ความเป็นไปได้มีมากมายหลายแบบ ลองเลือก พรรคหลัก,
              พรรคร่วมรัฐบาล และ จำนวนเสียงที่ได้จากส.ว. แล้วดูผล
            </p>
          </header>
          <div className="col">
            <GovernmentPanel
              electionResult={electionResult}
              onChange={value => {
                this.setState({
                  governmentConfig: value,
                });
              }}
            />
          </div>
          <div className="col">{simulation && simulation.printResult()}</div>
        </section>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
