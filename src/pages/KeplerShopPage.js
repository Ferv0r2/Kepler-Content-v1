import React, { Component, useRef } from "react";
import caver from "klaytn/caver";

import Layout from "../components/Layout";
import Nav from "components/Nav";
import Modal from "components/Modal";

import items from "./item.json";

import "./KeplerShopPage.scss";

const mintCA = "0x1eBA71383290bf924F3FE6f06E7D74572d1C5144";
const itemCA = "0x31756CAa3363516C01843F96f6AA7d9c922163b3";

class KeplerShopPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      isLoading: true,
      currentIdx: 0,
      use: false,
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
        klaytn.on("accountsChanged", () => {
          this.setAccountInfo(klaytn);
        });
      } catch (error) {
        console.log(error);
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
    if (window.innerWidth <= 540) {
      this.ref.current.style.left = -num * 370 + "px";
    } else if (window.innerWidth <= 640) {
      this.ref.current.style.left = -num * 450 + "px";
    } else {
      this.ref.current.style.left = -num * 600 + "px";
    }
    this.setState({ currentIdx: num });
  };

  prevSlide = () => {
    const { currentIdx } = this.state;
    if (currentIdx !== 0) {
      this.moveSlide(currentIdx - 1);
    }
  };

  nextSlide = () => {
    const { currentIdx } = this.state;
    const slideCount = 3;
    if (currentIdx !== slideCount - 1) {
      this.moveSlide(currentIdx + 1);
    }
  };

  // setOwnKey = async (idx) => {
  //   const { account } = this.state;
  //   const itemContract = new caver.klay.Contract(
  //     [
  //       {
  //         constant: true,
  //         inputs: [
  //           {
  //             internalType: "address",
  //             name: "account",
  //             type: "address",
  //           },
  //           {
  //             internalType: "uint256",
  //             name: "id",
  //             type: "uint256",
  //           },
  //         ],
  //         name: "balanceOf",
  //         outputs: [
  //           {
  //             internalType: "uint256",
  //             name: "",
  //             type: "uint256",
  //           },
  //         ],
  //         payable: false,
  //         stateMutability: "view",
  //         type: "function",
  //       },
  //     ],
  //     itemCA
  //   );

  //   const key = await itemContract.methods.balanceOf(account, idx + 39).call();

  //   this.setState({
  //     key,
  //   });
  // };

  sendTx = async () => {
    const { use, account, currentIdx } = this.state;
    if (use == true) {
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
              name: "_boxId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_count",
              type: "uint256",
            },
          ],
          name: "useKey",
          outputs: [],
          payable: true,
          stateMutability: "payable",
          type: "function",
        },
      ],
      mintCA
    );

    const num = await this.gachaId();

    const useKey = await minterContract.methods
      .useKey(account, currentIdx, 1)
      .send({
        from: account,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
        this.setState({ use: true });
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        this.setState({ use: true });
      })
      .on("error", (error) => {
        console.log("error", error);
        this.setState({ use: false });
        alert("상자깡이 취소되었습니다.");
      });
  };

  render() {
    const { account, balance, isLoading, limit, currentIdx } = this.state;
    const boxs = ["Normal Box", "Rare Box", "Unique Box"];

    return (
      <Layout>
        <div className="KeplerShopPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerShopPage__main">
            <div className="KeplerShopPage__title">
              <img src="images/shop/goldot_shop_logo.png" />
            </div>
            <div className="KeplerShopPage__subtitle">
              <p>골닷 상점에 오신 걸 환영합니다</p>
            </div>
            <div className="KeplerShopPage__banner">
              <img src="images/shop/goldot_shop_banner.png" />
            </div>
            <div className="KeplerShopPage__contents">
              {/* <div className="KeplerShopPage__boxs">
                <div id="slideShow_box">
                  <ul className="slides" ref={this.ref}></ul>
                </div>
              </div> */}
              <div className="KeplerShopPage__table">
                <div className="table_title">
                  <img src="images/shop/box_bg.png" />
                </div>
                <div className="table_title">
                  <img src="images/shop/box_title.png" />
                </div>
                <div className="table_contents">
                  <div className="items">
                    <ul className="item">
                      <li className="item_bg">
                        <img src="images/shop/faded_stone.png" />
                      </li>
                      <li className="item_mul">X</li>
                      <li className="item_count">10</li>
                      <li>
                        <img src="images/shop/after.png" />
                      </li>
                      <li className="item_bg">
                        <img src="images/shop/normal_pickaxe.png" />
                      </li>
                      <li className="item_border">
                        <div>교환</div>
                      </li>
                    </ul>
                    <div>
                      <label>남은 빛바랜 스톤 갯수</label>
                      15
                    </div>
                  </div>
                </div>
              </div>

              <div className="table_changer">
                <span className="prev">
                  <img src="images/shop/left.png" onClick={this.prevSlide} />
                </span>
                <span className="next">
                  <img src="images/shop/right.png" onClick={this.nextSlide} />
                </span>
              </div>

              <div className="check">
                <p>
                  6 Klay 이상 소유해야 트랜잭션이 에러를 발생시키지 않습니다
                  (최대 가스비 인상 때문)
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerShopPage;
