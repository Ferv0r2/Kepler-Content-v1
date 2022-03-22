import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KeplerMainPage from "pages/KeplerMainPage";
import KeplerEvolPage from "pages/KeplerEvolPage";
import KeplerGovernancePage from "pages/KeplerGovernancePage";
import KeplerProposalPage from "pages/KeplerProposalPage";

import "./App.scss";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KeplerMainPage />} />
          <Route path="/evol" element={<KeplerEvolPage />} />
          <Route path="/governance" element={<KeplerGovernancePage />} />
          <Route path="/governance/1" element={<KeplerProposalPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
