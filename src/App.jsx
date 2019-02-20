import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import { createComponent } from 'react-d3kit';
import ElectionResultPanel from './components/ElectionResultPanel';
import GovernmentPanel from './components/GovernmentPanel';
import RawGovernmentVis from './components/GovernmentVis';
import Simulation from './models/Simulation';

const GovernmentVis = createComponent(RawGovernmentVis);

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
          <header className="row">
            <div className="col">
              <h3>ขั้นที่ 1. สมมติว่าแต่ละพรรคได้ส.ส.เท่านี้</h3>
            </div>
          </header>
          <div className="row">
            <div className="col">
              <ElectionResultPanel
                onChange={value => {
                  this.setState({ electionResult: value });
                }}
              />
            </div>
          </div>
        </section>
        <section className="container">
          <header className="row">
            <div className="col">
              <h3>ขั้นที่ 2. ลองจัดตั้งรัฐบาล</h3>
            </div>
          </header>
          <div className="row">
            <div className="col">
              <p>
                เมื่อได้จำนวนส.ส.แล้ว ก็ถึงเวลาที่พรรคต่างๆจะจับมือกัน
                เพื่อเลือกนายกฯและจัดตั้งรัฐบาล กติกามีอยู่ว่า
              </p>
              <ul>
                <li>
                  ผู้โหวตเลือกนายกรัฐมนตรี คือ ส.ว. 250 คน และส.ส.จากการเลือกตั้ง 500 คน
                  ต้องมีเสียงเกินครึ่งหนึ่ง คืออย่างน้อย 376 เสียง
                </li>
                <li>ต้องการส.ส.อย่างน้อย 251 เสียง เพื่อให้มีเสียงในสภาผู้แทนราษฎรเกินครึ่ง</li>
              </ul>
              <p />
              <p>ลองเลือก พรรคหลัก, พรรคร่วมรัฐบาล และ จำนวนเสียงที่ได้จากส.ว. แล้วดูผล</p>

              <GovernmentPanel
                electionResult={electionResult}
                onChange={value => {
                  this.setState({
                    governmentConfig: value,
                  });
                }}
              />
            </div>
            <div className="col">
              แผนภาพต่อไปนี้ถูกสร้างจากสิ่งที่คุณเลือกมาทั้งหมด โดยใช้สี่เหลี่ยมแทนส.ว. วงกลมแทนส.ส.
              พรรคร่วมรัฐบาลและส.ว.ที่ร่วมเลือกนายกฯจะถูกนำมาเรียงรวมกันทางด้านซ้าย
              จะชนะเลือกตั้งได้หรือไม่นั้น ต้องดูว่ารวมกันแล้วได้เกินเส้นประที่ขีดไว้หรือไม่
              <GovernmentVis data={simulation} />
              <div className="summary">
                <b>ผล:</b>&nbsp;
                {simulation && simulation.printResult()}
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
