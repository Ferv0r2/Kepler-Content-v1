import React from "react";

import "./NFTBox.scss";

const url = "https://klu.bs/pfp/0x928267E7dB3d173898553Ff593A78719Bb16929F/";

const NFTBox = ({ data, tokenURI }) => {
  return (
    <div className="NFTBox">
      {data ? (
        <a className="NFTBox__link" target="_blank" href={url + data}>
          <p className="NFTBox__name">{data}</p>
          <img className="NFTBox__img" src={tokenURI} />
        </a>
      ) : (
        <img className="NFTBox__img" src={tokenURI} />
      )}
    </div>
  );
};

export default NFTBox;
