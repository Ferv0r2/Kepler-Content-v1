import React from "react";
import NFTBox from "./NFTBox";

import "./EvolTable.scss";

const url = "https://klu.bs/pfp/0x928267e7db3d173898553ff593a78719bb16929f/";

const EvolTable = ({ name, data, tokenURI, info }) => {
  const datas = data;
  const tokenURIs = tokenURI;
  return (
    <div className="EvolTable">
      <div className="EvolTable__infoBox">
        <div className="EvolTable__token">
          <h2>
            {name} ({datas.length})
          </h2>
        </div>
        <ul>
          {datas.length != 0 ? (
            datas.map((v, i) => {
              return (
                <li key={i}>
                  <NFTBox data={datas[i]} tokenURI={tokenURIs[i]}></NFTBox>
                  {/* <NFTBox data={datas[i]}></NFTBox> */}
                </li>
              );
            })
          ) : (
            <h2>{info}</h2>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EvolTable;
