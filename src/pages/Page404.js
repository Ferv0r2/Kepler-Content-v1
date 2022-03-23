import React from "react";
import { Link } from "react-router-dom";

import "./Page404.scss";

const Page404 = () => {
  return (
    <div className="Page404__error">
      <img src="images/main_icon.png" />
      <div className="Page404__info">This page is in preparation.</div>
      <div className="Page404__home">
        <Link to="/">Go to Home</Link>
      </div>
    </div>
  );
};

export default Page404;
