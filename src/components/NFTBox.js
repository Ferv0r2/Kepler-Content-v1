import React from "react";

import "./NFTBox.scss";

const url = "https://klu.bs/pfp/0x928267E7dB3d173898553Ff593A78719Bb16929F/";

const NFTBox = ({ data, tokenURI }) => {
  const onErrorImg = (e) => {
    e.target.style = `display: none`;
  };

  return (
    <div className="NFTBox">
      {data ? (
        <a className="NFTBox__link" target="_blank" href={url + data}>
          <p className="NFTBox__name">{data}</p>
          <div className="NFTBox__img">
            <img src={tokenURI} onError={onErrorImg} />
            <video src={tokenURI} autoPlay loop onError={onErrorImg} />
          </div>
        </a>
      ) : (
        <>
          <div className="NFTBox__img">
            <img src={tokenURI} onError={onErrorImg} />
            <video src={tokenURI} autoPlay loop onError={onErrorImg} />
          </div>
        </>
      )}
    </div>
  );
};

export default NFTBox;
