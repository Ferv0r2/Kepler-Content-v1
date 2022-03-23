import React from "react";
import caver from "../klaytn/caver";
import keplerContract from "../klaytn/KeplerContract";

import "./Token.scss";

const govCA = "0xC423E1f75C3676AE3b52BA55F72b1d2b8F44b3AD";
const nftCA = "0xf1919F40af70394762bed30E98d95DdFbac79080";

const index = 1;

let voteAgrees = [];
let voteDegrees = [];
const Token = ({ address, balance, tokenURI }) => {
  return (
    <div className="Token" id="card">
      <div className="Token__box">
        <div className="Token__balance">
          <label>투표 가능한 NFT 갯수 : {balance}</label>
        </div>
        <div className="Token__info">
          <div className="Token__id"></div>
          <div className="Token__img">
            <img src={tokenURI} />
          </div>
        </div>
        <div className="Token__agree" onClick={voteAgree}>
          찬성
        </div>
        <div className="Token__degree" onClick={voteDegree}>
          반대
        </div>
      </div>
    </div>
  );
};

export default Token;
