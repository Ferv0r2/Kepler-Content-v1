import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import KeplerMainPage from "pages/KeplerMainPage";
import KeplerBoxPage from "pages/KeplerBoxPage";
import KeplerMiningPage from "pages/KeplerMiningPage";
import KeplerEvolPage from "pages/KeplerEvolPage";
import KeplerShopPage from "pages/KeplerShopPage";
import KeplerGovernanceListPage from "pages/KeplerGovernanceListPage";
import KeplerGovernancePage from "pages/KeplerGovernancePage";
import KeplerProposalPage from "pages/KeplerProposalPage";
import ErrorPage from "pages/Page404";

import "./App.scss";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes basename="/">
          <Route path="/" element={<KeplerMainPage />} />
          <Route path="/box" element={<KeplerBoxPage />} />
          <Route path="/mining" element={<KeplerMiningPage />} />
          {/* <Route path="/evol" element={<KeplerEvolPage />} /> */}
          <Route path="/shop" element={<KeplerShopPage />} />
          <Route path="/shop" element={<ErrorPage />} />
          {/* <Route path="/governance" element={<KeplerGovernanceListPage />} /> */}
          <Route path="/governance" element={<ErrorPage />} />
          <Route path="/governance/0" element={<KeplerGovernancePage />} />
          {/* <Route path="/governance/proposal" element={<KeplerProposalPage />} /> */}
          <Route path="/governance/proposal" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
