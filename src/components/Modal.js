import React from "react";
import tokenImg from "../pages/tokenImg.json";

import "./modal.scss";

const Modal = ({ open, close, header, currentIdx, gachaItem }) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴

  const box_Type = ["box_normal", "box_rare", "box_unique"];
  console.log("item", gachaItem);
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            {/* {props.children} */}
            <div className="Box_modal">
              <div className="Openbox">
                <video
                  muted="muted"
                  autoPlay="autoPlay"
                  poster={`../images/box/${box_Type[currentIdx]}.png`}
                >
                  <source src={`../video/${box_Type[currentIdx]}.mov`} />
                </video>
                <p>상자 여는중 ...</p>
              </div>
              <div className="Item">
                <div className="Item__img">
                  <img
                    src={`images/items/${tokenImg["code"][gachaItem]}.png`}
                  />
                </div>
                <div className="Item__content">
                  <p className="Item__name">'{tokenImg["name"][gachaItem]}'</p>
                  <p className="Item__effect">
                    {tokenImg["effect"][gachaItem]}
                  </p>
                </div>
                <div className="Item__close">
                  <button onClick={close}>확인</button>
                </div>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
