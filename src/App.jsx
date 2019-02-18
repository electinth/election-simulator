import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';
import RepresentativeControlPanel from './components/RepresentativeControlPanel';

class App extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <section class="container">
          <header class="col">
            <h3>ขั้นที่ 1. สมมติว่าแต่ละพรรคได้ส.ส.เท่านี้</h3>
          </header>
          <div class="col">
            <RepresentativeControlPanel />
          </div>
        </section>
        <section class="container">
          <header class="col">
            <h3>ขั้นที่ 2. ลองจัดตั้งรัฐบาล</h3>
            <p>
              หลังจากการเลือกตั้งและนับคะแนน
              ก็ถึงเวลาที่บรรดาพรรคการเมืองจะจับมือกัน
              เพื่อเลือกนายกรัฐมนตรีและจัดตั้งรัฐบาล
              ความเป็นไปได้มีมากมายหลายแบบ
              ลองเลือก พรรคหลัก, พรรคร่วมรัฐบาล และ จำนวนเสียงที่ได้จากส.ว. แล้วดูผล
            </p>
          </header>
          <div class="col">
            under construction
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
