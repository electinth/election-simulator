import './css/fonts.css';
import './css/style-header-white.css';
import './css/style.css';

import React from 'react';
import { hot } from 'react-hot-loader';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section class="container">
          <header class="col">
            <h3>ขั้นที่ 1. สมมติว่าแต่ละพรรคได้ส.ส.เท่านี้</h3>
          </header>
          <div class="col">
            under construction
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
              ลองเลือกพรรคหลัก, พรรคร่วมรัฐบาล และ จำนวนเสียงที่ได้จากส.ว. ดู
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
