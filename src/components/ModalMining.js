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

                {/* {gachaItem.map((v, i) => {
                    <img
                      src={`../images/items/${
                        miningImg["code"][gachaItem[i]]
                      }.png`}
                    />;
                  })} */}

                {currentIdx == 0 ? (
                  <div className="Mining__img">
                    <img
                      className="item3"
                      src={`images/items/${
                        miningImg["code"][gachaItem[0]]
                      }.png`}
                    />
                  </div>
                ) : null}

                {currentIdx == 1 ? (
                  <div className="Mining__img">
                    <img
                      className="item2"
                      src={`images/items/${
                        miningImg["code"][gachaItem[0]]
                      }.png`}
                    />
                    <img
                      className="item4"
                      src={`images/items/${
                        miningImg["code"][gachaItem[1]]
                      }.png`}
                    />
                  </div>
                ) : null}

                {currentIdx == 2 ? (
                  <div className="Mining__img">
                    <img
                      className="item1"
                      src={`images/items/${
                        miningImg["code"][gachaItem[0]]
                      }.png`}
                    />
                    <img
                      className="item3"
                      src={`images/items/${
                        miningImg["code"][gachaItem[1]]
                      }.png`}
                    />
                    <img
                      className="item5"
                      src={`images/items/${
                        miningImg["code"][gachaItem[2]]
                      }.png`}
                    />
                  </div>
                ) : null}
                {/* {gachaItem.map((v, i) => {
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[i]]}
                    </p>;
                  })} */}
                {currentIdx == 0 ? (
                  <div className="Mining__content">
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[0]]}
                    </p>
                  </div>
                ) : null}
                {currentIdx == 1 ? (
                  <div className="Mining__content">
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[0]]}
                    </p>
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[1]]}
                    </p>
                  </div>
                ) : null}
                {currentIdx == 2 ? (
                  <div className="Mining__content">
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[0]]}
                    </p>
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[1]]}
                    </p>
                    <p className="Mining__name">
                      {miningImg["name"][gachaItem[2]]}
                    </p>
                  </div>
                ) : null}
                <div className="Mining__close">
                  <button onClick={close}>확인</button>
                </div>
              </div>
            </div>
          </main>
        </section>
      ) : null}
      {currentIdx == 0 && open ? (
        <div className="crack">
          <div className="crack3">
            <img
              src={`../images/items/${miningImg["code"][gachaItem[0]]}.png`}
            />
            {miningImg["name"][gachaItem[0]]}
          </div>
        </div>
      ) : null}
      {currentIdx == 1 && open ? (
        <div className="crack">
          <div className="crack3">
            <img
              src={`../images/items/${miningImg["code"][gachaItem[0]]}.png`}
            />
            {miningImg["name"][gachaItem[0]]}
          </div>
          <div className="crack2">
            <img
              src={`../images/items/${miningImg["code"][gachaItem[1]]}.png`}
            />
            {miningImg["name"][gachaItem[1]]}
          </div>
        </div>
      ) : null}
      {currentIdx == 2 && open ? (
        <div className="crack">
          <div className="crack3">
            <img
              src={`../images/items/${miningImg["code"][gachaItem[0]]}.png`}
            />
            {miningImg["name"][gachaItem[0]]}
          </div>
          <div className="crack2">
            <img
              src={`../images/items/${miningImg["code"][gachaItem[1]]}.png`}
            />
            {miningImg["name"][gachaItem[1]]}
          </div>
          <div className="crack1">
            <img
              src={`../images/items/${miningImg["code"][gachaItem[2]]}.png`}
            />
            {miningImg["name"][gachaItem[2]]}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ModalMining;
