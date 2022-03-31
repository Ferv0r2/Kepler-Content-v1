import React, { Component, useRef } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import Layout from "../components/Layout";
import Nav from "components/Nav";
import Modal from "components/Modal";

import items from "./item.json";

import "./KeplerBoxPage.scss";

class KeplerBoxPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      isLoading: true,
      currentIdx: 0,
      modalOpen: false,
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.loadAccountInfo();
    this.setNetworkInfo();
  }

  loadAccountInfo = async () => {
    const { klaytn } = window;

    if (klaytn) {
      try {
        await klaytn.enable();
        this.setAccountInfo(klaytn);
        klaytn.on("accountsChanged", () => {
          this.setAccountInfo(klaytn);
        });
      } catch (error) {
        // console.log(error);
        console.log("User denied account access");
      }
    } else {
      console.log(
        "Non-Kaikas browser detected. You should consider trying Kaikas!"
      );
    }
  };

  setAccountInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    const account = klaytn.selectedAddress;
    const balance = await caver.klay.getBalance(account);
    this.setState({
      account,
      isLoading: false,
      balance: caver.utils.fromPeb(balance, "KLAY"),
    });
  };

  setNetworkInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    this.setState({ network: klaytn.networkVersion });
    klaytn.on("networkChanged", () =>
      this.setNetworkInfo(klaytn.networkVersion)
    );
  };

  moveSlide = (num) => {
    const { currentIdx } = this.state;
    this.ref.current.style.left = -num * 600 + "px";

    this.setState({ currentIdx: num });
  };

  prevSlide = () => {
    const { currentIdx } = this.state;
    if (currentIdx !== 0) this.moveSlide(currentIdx - 1);
  };

  nextSlide = () => {
    const { currentIdx } = this.state;
    const slideCount = 3;
    if (currentIdx !== slideCount - 1) this.moveSlide(currentIdx + 1);
  };

  //   sendTx = () => {
  //     const { from,counter, gas, valueName} = this.state

  //     const data = caver.klay.abi.encodeFunctionCall(
  //       {
  //         name: 'mintSingle',
  //         type: 'function',
  //         inputs: [
  //           {
  //             type: 'address',
  //             name: '_to'
  //           },
  //           {
  //             type: 'string',
  //             name: '_tokenURI'
  //           }
  //         ]
  //       },["0x105cb1540D2CC934b03A9bC41D541E9495742929", valueName]
  //     )

  //     caver.klay
  //       .sendTransaction({
  //         from,
  //         to: "0xd13747aedffd4c9be34f66c09f32146800754df4",
  //         data,
  //         gas,
  // //caver.utils.toBN(price * counter)

  //       })
  //       .on('transactionHash', transactionHash => {
  //         console.log('txHash', transactionHash)
  //         this.setState({ txHash: transactionHash })
  //       })
  //       .on('receipt', receipt => {
  //         console.log('receipt', receipt)
  //         alert('신청이 정상적으로 완료되었습니다.')
  //         this.setState({ receipt: JSON.stringify(receipt) })
  //       })
  //       .on('error', error => {
  //         console.log('error', error)
  //         this.setState({ error: error.message })
  //       })

  //   }

  sendTx = () => {
    console.log("btn click");

    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    console.log("close");
    this.setState({ modalOpen: false });
  };

  render() {
    const { account, balance, isLoading, currentIdx, modalOpen } = this.state;
    const boxs = ["Normal Box", "Rare Box", "Unique Box"];

    return (
      <Layout>
        <div className="KeplerBoxPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerBoxPage__main">
            <div className="KeplerBoxPage__contents">
              <div className="KeplerBoxPage__boxs">
                <div id="slideShow">
                  <ul className="slides" ref={this.ref}>
                    <li>
                      <img src="images/box/box_normal.png" />
                    </li>
                    <li>
                      <img src="images/box/box_rare.png" />
                    </li>
                    <li>
                      <img src="images/box/box_unique.png" />
                    </li>
                  </ul>
                  <Modal open={modalOpen} close={this.closeModal} />
                  <span className="prev">
                    <img src="images/left.png" onClick={this.prevSlide} />
                  </span>
                  <span className="next">
                    <img src="images/right.png" onClick={this.nextSlide} />
                  </span>
                  <p>{boxs[currentIdx]}</p>
                </div>
              </div>
              <div className="KeplerBoxPage__mint">
                <div className="mint_btn" onClick={this.sendTx}>
                  OPEN BOX
                </div>
                <p>Limit : 50 / 200</p>
              </div>

              <div className="KeplerBoxPage__payable">
                <div className="box_price">
                  <label>Price</label>
                  <p>1 box = 10 klay</p>
                </div>
                <div className="klay_balance">
                  <label>Your Klay</label>
                  <p>your klay balance = 100 klay</p>
                </div>
              </div>
              <div className="KeplerBoxPage__table">
                <div className="table_title">Percentage Table</div>
                <div className="table_contents">
                  <div>
                    <div className="content_potion">
                      <label>기존 포션</label>
                      <li>
                        <p>대형 5종류 각 {items.large_potion[currentIdx]}%</p>
                        <p>총 {items.large_potion[currentIdx] * 5}%</p>
                      </li>
                      <li>
                        <p>중형 5종류 각 {items.medium_potion[currentIdx]}%</p>
                        <p>총 {items.medium_potion[currentIdx] * 5}%</p>
                      </li>
                      <li>
                        <p>소형 5종류 각 {items.small_potion[currentIdx]}%</p>
                        <p>총 {items.small_potion[currentIdx] * 5}%</p>
                      </li>
                    </div>
                    <div className="content_potion_mix">
                      <label>믹스종 포션</label>
                      <li>
                        <p>
                          대형 5종류 각 {items.large_mix_potion[currentIdx]}%
                        </p>
                        <p>총 {items.large_mix_potion[currentIdx] * 5}%</p>
                      </li>
                      <li>
                        <p>
                          중형 5종류 각 {items.medium_mix_potion[currentIdx]}%
                        </p>
                        <p>총 {items.medium_mix_potion[currentIdx] * 5}%</p>
                      </li>
                      <li>
                        <p>
                          소형 5종류 각 {items.small_mix_potion[currentIdx]}%
                        </p>
                        <p>총 {items.small_mix_potion[currentIdx] * 5}%</p>
                      </li>
                    </div>
                  </div>
                  <div>
                    <div className="content_pick">
                      <label>곡괭이</label>
                      <li>
                        <p>상급 곡괭이</p>
                        <p>총 {items.advanced_pickaxe[currentIdx]}%</p>
                      </li>
                      <li>
                        <p>중급 곡괭이</p>
                        <p>총 {items.intermediate_pickaxe[currentIdx]}%</p>
                      </li>
                      <li>
                        <p>하급 곡괭이</p>
                        <p>총 {items.low_pickaxe[currentIdx]}%</p>
                      </li>
                    </div>
                    <div className="content_stone">
                      <label>믹스 스톤</label>
                      <li>
                        <p>믹스 스톤 각 {items.stone[currentIdx]}%</p>
                        <p>총 {items.stone[currentIdx] * 5}%</p>
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerBoxPage;
