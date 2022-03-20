import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KeplerGovernancePage from "pages/KeplerGovernancePage";
import KeplerEvolPage from "pages/KeplerEvolPage";

import "./App.scss";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KeplerGovernancePage />} />
          <Route path="/evol" element={<KeplerEvolPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
