import React, { Component, useRef } from "react";
import caver from "klaytn/caver";
// import fetch from "node-fetch";

import Layout from "../components/Layout";
import Nav from "components/Nav";
import Modal from "components/Modal";

import items from "./item.json";

import "./KeplerBoxPage.scss";

const mintCA = "0xB9D8d1f5b13214c78bea9d657a8933275b11f191";

class KeplerBoxPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      isLoading: true,
      currentIdx: 0,
      limit: 0,
      use: false,
      mintPrice: 0,
      gachaItem: 0,
      modalOpen: false,
      txHash: "",
      receipt: false,
      error: false,
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
        this.setLimit(0);
        this.setMintPrice(0);
        klaytn.on("accountsChanged", () => {
          this.setAccountInfo(klaytn);
          this.setLimit(0);
          this.setMintPrice(0);
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
    let balance = await caver.klay.getBalance(account);
    balance = (balance / 1000000000000000000).toFixed(2);

    this.setState({
      account,
      balance,
      isLoading: false,
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
    if (currentIdx !== 0) {
      this.moveSlide(currentIdx - 1);
      this.setLimit(currentIdx - 1);
      this.setMintPrice(currentIdx - 1);
    }
  };

  nextSlide = () => {
    const { currentIdx } = this.state;
    const slideCount = 3;
    if (currentIdx !== slideCount - 1) {
      this.moveSlide(currentIdx + 1);
      this.setLimit(currentIdx + 1);
      this.setMintPrice(currentIdx + 1);
    }
  };

  setLimit = async (idx) => {
    const minterContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "limit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      mintCA
    );

    const boxLimit = await minterContract.methods.limit(idx).call();
    this.setState({
      limit: boxLimit,
    });
  };

  setMintPrice = async (idx) => {
    const minterContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "mintPrice",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      mintCA
    );

    let mintPrice = await minterContract.methods.mintPrice(idx).call();
    mintPrice = mintPrice / 1000000000000000000;
    this.setState({
      mintPrice,
    });
  };

  gachaId = async () => {
    const { use, currentIdx } = this.state;
    if (use) {
      return;
    }

    const itemGacha = Math.random() * 100; // 0 ~ 99 실수
    const itemNum = Math.floor(Math.random() * 5); // 0 ~ 4

    const largeP = items.large_potion[currentIdx] * 5;
    const largeMP = items.large_mix_potion[currentIdx] * 5 + largeP;
    const mediumP = items.medium_potion[currentIdx] * 5 + largeMP;
    const mediumMP = items.medium_mix_potion[currentIdx] * 5 + mediumP;
    const smallP = items.small_potion[currentIdx] * 5 + mediumMP;
    const smallMP = items.small_mix_potion[currentIdx] * 5 + smallP;
    const stoneM = items.stone[currentIdx] * 5 + smallMP;
    const pickA = items.low_pickaxe[currentIdx] + stoneM;
    const pickB = items.intermediate_pickaxe[currentIdx] + pickA;
    const pickC = items.advanced_pickaxe[currentIdx] + pickB;

    let pointer = 0;
    if (itemGacha < largeP) {
      pointer = itemNum;
    } else if (itemGacha < largeMP) {
      pointer = itemNum + 5;
    } else if (itemGacha < mediumP) {
      pointer = itemNum + 10;
    } else if (itemGacha < mediumMP) {
      pointer = itemNum + 15;
    } else if (itemGacha < smallP) {
      pointer = itemNum + 20;
    } else if (itemGacha < smallMP) {
      pointer = itemNum + 25;
    } else if (itemGacha < stoneM) {
      pointer = itemNum + 30;
    } else if (itemGacha < pickA) {
      pointer = 36;
    } else if (itemGacha < pickB) {
      pointer = 37;
    } else if (itemGacha < pickC) {
      pointer = 38;
    } else {
      console.log("error");
    }

    this.setState({ gachaItem: pointer });
  };

  sendTxPay = async () => {
    const { use, account, currentIdx, mintPrice } = this.state;
    if (use == true) {
      return;
    }

    const minterContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_boxId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_count",
              type: "uint256",
            },
          ],
          name: "useCoin",
          outputs: [],
          payable: true,
          stateMutability: "payable",
          type: "function",
        },
      ],
      mintCA
    );

    const num = await this.gachaId();

    // const useCoin = await minterContract.methods
    //   .useCoin(currentIdx, 1)
    //   .send({
    //     type: "SMART_CONTRACT_EXECUTION",
    //     from: account,
    //     gas: 7500000,
    //     value: caver.utils.toPeb(mintPrice, "KLAY"),
    //   })
    //   .on("transactionHash", (transactionHash) => {
    //     console.log("txHash", transactionHash);
    //     this.setState({ use: true });
    //   })
    //   .on("receipt", (receipt) => {
    //     console.log("receipt", receipt);
    //     this.setState({ use: true });
    //   })
    //   .on("error", (error) => {
    //     console.log("error", error);
    //     alert("상자깡이 취소되었습니다.");
    //     return false;
    //   });
    this.setState({ use: true });
  };

  sendTx = async () => {
    const { account, currentIdx, balance, mintPrice, limit } = this.state;

    // 클레이 결제용
    if (balance <= mintPrice) {
      alert("클레이가 부족합니다.");
      return;
    }

    if (limit == 0) {
      alert("남은 상자가 없습니다.");
      return;
    }

    const minterContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "_account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_count",
              type: "uint256",
            },
          ],
          name: "mintItem",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      mintCA
    );

    const pay = await this.sendTxPay();
    const { use } = this.state;

    // if (use) {
    //   await new Promise((resolve) => {
    //     setTimeout(async () => {
    //       await minterContract.methods
    //         .mintItem(account, currentIdx, 1)
    //         .send({
    //           from: account,
    //           gas: 7500000,
    //         })
    //         .on("transactionHash", (transactionHash) => {
    //           console.log("txHash", transactionHash);
    //           this.setState({ txHash: transactionHash });
    //         })
    //         .on("receipt", (receipt) => {
    //           console.log("receipt", receipt);
    //           // alert('신청이 정상적으로 완료되었습니다.')
    //           this.setState({
    //             receipt: JSON.stringify(receipt),
    //             modalOpen: true,
    //           });
    //         })
    //         .on("error", (error) => {
    //           console.log("error", error);
    //           alert("상자깡이 취소되었습니다.");
    //           this.setState({ error: error.message });
    //         });
    //       resolve();
    //     }, 200);
    //   });
    // } else {
    //   alert("클레이가 지불되지 않았습니다.");
    // }
    this.setState({
      modalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
      use: false,
    });
  };

  render() {
    const {
      account,
      balance,
      isLoading,
      limit,
      mintPrice,
      currentIdx,
      gachaItem,
      modalOpen,
    } = this.state;
    const boxs = ["Normal Box", "Rare Box", "Unique Box"];
    const max = [100, 50, 30];

    return (
      <Layout>
        <div className="KeplerBoxPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerBoxPage__main">
            <div className="KeplerBoxPage__contents">
              <div className="KeplerBoxPage__boxs">
                <div id="slideShow_box">
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
                  <Modal
                    open={modalOpen}
                    currentIdx={currentIdx}
                    gachaItem={gachaItem}
                    close={this.closeModal}
                  />
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
                <p>
                  Limit : {limit} / {max[currentIdx]}
                </p>
              </div>

              <div className="KeplerBoxPage__payable">
                <div className="box_price">
                  <label>Price</label>
                  <p>1 box = {mintPrice} klay</p>
                </div>
                <div className="klay_balance">
                  <label>Your Klay</label>
                  <p>your klay balance = {balance} klay</p>
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
