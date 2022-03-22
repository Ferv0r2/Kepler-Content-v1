import React from "react";
import Loading from "components/Loading";
import "./Nav.scss";

const Nav = ({ address }) => (
  <header className="Nav">
    <div className="Nav__inner">
      <h1 className="Nav__logo">
        <a href="/">
          <img src="images/logo.png" alt="Kepler-452b" />
        </a>
      </h1>
      <div className="Nav__address">
        {address || (
          <div className="Nav__loading">
            <Loading />
          </div>
        )}
      </div>
    </div>
  </header>
);

export default Nav;
