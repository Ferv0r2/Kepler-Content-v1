import React from "react";

import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer__main">
        <div className="Footer__contents">
          <div className="Footer__logo">
            <img src="images/logo.png" />
          </div>
          <div className="Footer__info">
            <p>
              CEO. Keplin <br />
              Addr. 서울특별시 중구 을지로 1가 케플러연구소 (가상) <br />
              COPYRIGHTⓒ 2022. K452. ALL RIGHT RESERVED.
            </p>
          </div>
          <div className="Footer__icons">
            <li>
              <a href="https://open.kakao.com/o/gTLz1aTd">
                <i className="fas fa-comment" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/Kepler_NFT">
                <i className="fab fa-twitter" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/kepler452b_nft/">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="https://opensea.io/collection/kepler-452b-official">
                <img src="images/opensea.png" />
              </a>
            </li>
            <li>
              <a href="https://klu.bs/pfp/0x928267E7dB3d173898553Ff593A78719Bb16929F">
                <i className="fab fa-kickstarter-k" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="https://kepler-452b.net">
                <img src="images/logo.png" />
              </a>
            </li>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
