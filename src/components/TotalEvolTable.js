import React from "react";
// import evol from "../pages/evol-log.json";

import "./TotalEvolTable.scss";

const url = "https://klu.bs/pfp/0x928267e7db3d173898553ff593a78719bb16929f/";

const TotalEvolTable = ({ evol, load }) => {
  return (
    <div className="TotalEvolTable">
      <h2 className="TotalEvolTable__title">Today's Evolution</h2>
      {load ? (
        <h2 className="TotalEvolTable_loading">
          전체 진화 번호를 로딩중입니다 :)
        </h2>
      ) : (
        <div>
          <h3 className="TotalEvolTable__date">{evol["date"]}</h3>
          <div className="TotalEvolTable__infoBox">
            <div className="TotalEvolTable__token">
              <h2>전체 진화 번호 ({evol.token.length})</h2>
              <div>
                {evol.token.length != 0 ? (
                  evol.token.map((v, i) => {
                    return (
                      <a key={i} href={url + evol.token[i]}>
                        <h3>{evol.token[i]}</h3>
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
      )}
    </div>
  );
};

export default TotalEvolTable;
