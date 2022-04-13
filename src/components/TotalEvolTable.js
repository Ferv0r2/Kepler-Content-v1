import React from "react";
import evol from "../pages/evol-log.json";

import "./TotalEvolTable.scss";

const url = "https://klu.bs/pfp/0x928267e7db3d173898553ff593a78719bb16929f/";
const len = evol["token"].length;

const TotalEvolTable = () => {
  // const tokenURIs = tokenURI;

  return (
    <div className="TotalEvolTable">
      <h2 className="TotalEvolTable__title">Today's Evolution</h2>
      <h3 className="TotalEvolTable__date">[ {evol["date"]} ]</h3>
      <div className="TotalEvolTable__infoBox">
        <div className="TotalEvolTable__token">
          <h2>전체 진화 번호 ({len})</h2>
          <div>
            {len != 0 ? (
              evol["token"].map((v, i) => {
                return (
                  <a key={i} href={url + evol["token"][i]}>
                    <h3>{evol["token"][i]}</h3>
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

export default TotalEvolTable;
