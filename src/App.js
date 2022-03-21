import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KeplerGovernancePage from "pages/KeplerGovernancePage";
import KeplerProposalPage from "pages/KeplerProposalPage";
import KeplerEvolPage from "pages/KeplerEvolPage";

import "./App.scss";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KeplerProposalPage />} />
          <Route path="/governace" element={<KeplerGovernancePage />} />
          <Route path="/evol" element={<KeplerEvolPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
