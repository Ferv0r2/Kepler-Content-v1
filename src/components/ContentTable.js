import React from "react";
import { Link } from "react-router-dom";
import "./ContentTable.scss";

const ContentTable = () => {
  // const tokenURIs = tokenURI;

  return (
    <div className="ContentTable">
      <h2 className="ContentTable__title">Kepler Contents</h2>
      <div className="ContentTable__infoBox">
        <img src="images/main_icon.png" />
        <div className="ContentTable__link">
          <li>
            <Link to="/evol">일일 진화 보러가기</Link>
          </li>
          {/* <li>
            <Link to="/box">랜덤 박스 보러가기</Link>
          </li> */}
          <li>
            <Link to="/governance">거버넌스 의제 보러가기</Link>
          </li>
        </div>
      </div>
    </div>
  );
};

export default ContentTable;
