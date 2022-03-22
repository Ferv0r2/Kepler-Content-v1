import React from "react";
import evol from "../pages/evol-log.json";

import "./ContentTable.scss";

const url = "https://klu.bs/pfp/0xf1919F40af70394762bed30E98d95DdFbac79080/";
const len = evol.length;

const ContentTable = () => {
  // const tokenURIs = tokenURI;

  return (
    <div className="ContentTable">
      <h2 className="ContentTable__title">Kepler Contents</h2>
      <div className="ContentTable__infoBox">
        <div className="ContentTable__token">
          <h2>전체 진화 번호 ({len})</h2>
          <div>
            {len != 0 ? (
              evol.map((v, i) => {
                return (
                  <a key={i} href={url + evol[i]}>
                    <h3>{evol[i]}</h3>
                  </a>
                );
              })
            ) : (
              <h2>비어 있습니다</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTable;
