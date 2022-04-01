import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import KeplerMainPage from "pages/KeplerMainPage";
import KeplerBoxPage from "pages/KeplerBoxPage";
import KeplerEvolPage from "pages/KeplerEvolPage";
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
          <Route path="/evol" element={<KeplerEvolPage />} />
          {/* <Route path="/governance" element={<KeplerGovernanceListPage />} /> */}
          <Route path="/governance" element={<ErrorPage />} />
          <Route path="/governance/0" element={<KeplerGovernancePage />} />
          {/* <Route path="/governance/proposal" element={<KeplerProposalPage />} /> */}
          <Route path="/governance/proposal" element={<ErrorPage />} />
        </Routes>
        <Link to="/" />
        <Link to="/evol" />
        {/* <Route path="/governance" element={<KeplerGovernanceListPage />} /> */}
        <Link to="/governance" />
        <Link to="/governance/0" />
        {/* <Route path="/governance/proposal" element={<KeplerProposalPage />} /> */}
        <Link to="/governance/proposal" />
      </div>
    </Router>
  );
};

export default App;
