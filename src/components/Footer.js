import React from "react";

import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer__main">
        <a href="https://open.kakao.com/o/gTLz1aTd">
          <i className="fas fa-comment" aria-hidden="true"></i>
          <h2>KakaoTalk</h2>
        </a>
        <a href="https://twitter.com/Kepler_NFT">
          <i className="fab fa-twitter" aria-hidden="true"></i>
          <h2>Twitter</h2>
        </a>
        <a href="https://www.instagram.com/kepler452b_nft/">
          <i className="fab fa-instagram" aria-hidden="true"></i>
          <h2>Instagram</h2>
        </a>
        <a href="https://klu.bs/pfp/0xf1919F40af70394762bed30E98d95DdFbac79080">
          <i className="fab fa-kickstarter-k" aria-hidden="true"></i>
          <h2>KLUBS</h2>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
