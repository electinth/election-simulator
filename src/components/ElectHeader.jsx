import React from 'react';

export default function ElectHeader() {
  return (
    <header className="site-header">
      <nav className="navbar navbar-light">
        <a className="navbar-brand" href="/">
          <img src="https://elect.in.th/site-logo.png" alt="ELECT.in.th logo" />
          <h6>In Vote We Trust</h6>
        </a>
        <div className="ml-auto d-flex navbar-more">
          <div className="lang" />
          <div className="social">
            <a href="https://www.facebook.com/electinth">
              <i className="fab fa-facebook-f fa-fw" />
            </a>
            <a href="https://twitter.com/electinth">
              <i className="fab fa-twitter fa-fw" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
