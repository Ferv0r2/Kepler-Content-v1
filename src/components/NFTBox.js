import React from "react";

import "./NFTBox.scss";

const url = "https://klu.bs/pfp/0x928267E7dB3d173898553Ff593A78719Bb16929F/";

const NFTBox = ({ data }) => {
  return (
    <div className="NFTBox">
      <a className="NFTBox__Name" href={url + data}>
        {/* Kepler-452b #{data} */}
        {data}
        {/* <img className="NFTBox__Img" src={tokenURI}></img> */}
      </a>
    </div>
  );
};

export default NFTBox;
