import React from "react";
import Loading from "./Loading";

import "./modal.scss";

const Modal = ({ open, close, header }) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴

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
                  poster="../images/box/box_normal.png"
                >
                  <source src="../video/box_normal.mov" />
                </video>
                <p>상자 여는중 ...</p>
              </div>
              <div className="Item">
                <div className="Item__img">
                  <img src="images/items/1L.png" />
                </div>
                <div className="Item__content">
                  <p className="Item__name">'1종 대형 포션'</p>
                  <p className="Item__effect">진화 확률 50% 증가</p>
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
