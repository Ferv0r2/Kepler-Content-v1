import React, { useState, useEffect } from "react";
import Footer from "components/Footer";

import "./Layout.scss";

const Layout = (props) => {
  const [scroll, setScroll] = useState(0);
  const [btn, setBtnStatus] = useState(false);

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", handleFollow);
    };
    watch();
    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  });

  const handleFollow = () => {
    setScroll(window.pageYOffset);
    if (scroll > 100) {
      // 100 이상이면 버튼이 보이게
      setBtnStatus(true);
    } else {
      // 100 이하면 버튼이 사라지게
      setBtnStatus(false);
    }
  };

  const toUp = (e) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScroll(0);
    setBtnStatus(false);
  };
  const { children } = props;
  return (
    <div className="Layout">
      <main>{children}</main>
      <Footer></Footer>
      {btn ? (
        <div className="toUp" onClick={(e) => toUp()}>
          <img src="images/onTop.png"></img>
          <p>On Top</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Layout;
