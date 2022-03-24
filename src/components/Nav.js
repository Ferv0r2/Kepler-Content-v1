import React from "react";
import Loading from "components/Loading";
import KeplerMainPage from "pages/KeplerMainPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Nav.scss";

const Nav = ({ address }) => (
  <header className="Nav">
    <div className="Nav__inner">
      <h1 className="Nav__logo">
        <Link to="/">
          <img src="images/logo.png" alt="Kepler-452b" />
        </Link>
      </h1>
      {address ? (
        <div className="Nav__address">
          <p>
            <img src="images/klaytn_logo.png" />
            {address}
          </p>
        </div>
      ) : (
        <div className="Nav__loading">
          <Loading />
        </div>
      )}
    </div>
  </header>
);

export default Nav;
