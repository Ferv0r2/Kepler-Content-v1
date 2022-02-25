import React from "react";

import "./NFTBox.scss";

const url = "https://klu.bs/pfp/0xf1919F40af70394762bed30E98d95DdFbac79080/";

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
