import React from "react";
import NFTBox from "./NFTBox";

import "./EvolTable.scss";

const url = "https://klu.bs/pfp/0xf1919F40af70394762bed30E98d95DdFbac79080/";

const EvolTable = ({ data }) => {
  const datas = data;
  // const tokenURIs = tokenURI;

  return (
    <div className="EvolTable">
      <div className="EvolTable__infoBox">
        <div className="EvolTable__token">
          <h2>내 진화 번호 ({datas.length})</h2>
        </div>
        <ul>
          {datas.length != 0 ? (
            datas.map((v, i) => {
              return (
                <li key={i}>
                  {/* <NFTBox data={datas[i]} tokenURI={tokenURIs[i]}></NFTBox> */}
                  <NFTBox data={datas[i]}></NFTBox>
                </li>
              );
            })
          ) : (
            <h2>금일 진화한 NFT가 없습니다...</h2>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EvolTable;
