import React from "react";
import miningImg from "../pages/miningImg.json";

import "./ModalMining.scss";

const ModalMining = ({
  open,
  close,
  header,
  currentIdx,
  destory,
  gachaItem,
}) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴

  const mining_Type = ["mining_normal", "mining_rare", "mining_unique"];

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? "openModal modal_Mining" : "modal_Mining"}>
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
            <div className="Box_modal_Mining">
              <div className="MiningStone">
                <video
                  muted="muted"
                  autoPlay="autoPlay"
                  poster={`../video/mining.png`}
                >
                  <source src={`../video/${mining_Type[currentIdx]}.mov`} />
                </video>
                <p>믹스스톤 채굴 중 입니다...</p>
              </div>
              <div className="Mining">
                <div className="Mining_result">채굴 결과</div>
                <div className="Mining__img">
                  <img
                    src={`../images/items/${miningImg["code"][gachaItem]}.png`}
                  />
                </div>
                <div className="Mining__content">
                  <p className="Mining__name">{miningImg["name"][gachaItem]}</p>
                </div>

                <div className="Mining__close">
                  <button onClick={close}>확인</button>
                </div>
              </div>
            </div>
          </main>
        </section>
      ) : null}
      {open ? (
        <div className="crack">
          <img src={`../images/items/${miningImg["code"][gachaItem]}.png`} />
          {miningImg["name"][gachaItem]}
        </div>
      ) : null}
    </div>
  );
};

export default ModalMining;
