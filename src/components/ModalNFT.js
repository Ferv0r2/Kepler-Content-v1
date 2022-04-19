import React from "react";

import Loading from "./Loading";

import "./ModalNFT.scss";

const ModalNFT = ({ open, tx, close, header, num1, num2, num3, urls }) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const num = [num1, num2, num3];

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? "openModal modalnft" : "modalnft"}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            <div className="nft_modal">
              <div className="nft_title">소각되는 NFT</div>
              <div className="nft_contents">
                {urls ? (
                  urls.map((v, i) => {
                    return (
                      <div className="nft_img" key={v}>
                        <img src={urls[i]} />
                        <div className="nft_num">{`#${num[i]}`}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="load">
                    <Loading />
                  </div>
                )}
              </div>
              <div className="nft_check">
                <p>이 NFT가 맞나요?</p>
              </div>
              <div className="checked" onClick={tx}>
                교환 확정
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default ModalNFT;
