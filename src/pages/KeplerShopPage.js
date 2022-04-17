import React, { Component, useRef } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";

import Layout from "../components/Layout";
import Nav from "components/Nav";

import "./KeplerShopPage.scss";

// const itemCA = "0x31756CAa3363516C01843F96f6AA7d9c922163b3";
const nftCA = "0x6859c58A2DC2fE89421ef0387fE9dBaf4a4413C7";
const itemCA = "0xB1f01670A962a177Cd814450A89820EF79E62C02";
const shopCA = "0x9DE831C25b6d7bd22F3f5EF5C527e4340ACD34Be";

class KeplerShopPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balanceNFT: 0,
      balanceStone: 0,
      isLoading: true,
      currentIdx: 0,
      num1: "",
      num2: "",
      num3: "",
      txHash: "",
      receipt: false,
      error: false,
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.setNetworkInfo();
    this.setOwn = setInterval(() => this.loadAccountInfo(), 1000);
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

    const nftContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
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
      nftCA
    );

    const itemContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "balanceOf",
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
      itemCA
    );

    const account = klaytn.selectedAddress;
    // const balanceNFT = await keplerContract.methods.balanceOf(account).call();
    const balanceNFT = await nftContract.methods.balanceOf(account).call();
    const balanceStone = await itemContract.methods
      .balanceOf(account, 35)
      .call();

    this.setState({
      account,
      balanceNFT,
      balanceStone,
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
    const slideCount = 2;
    if (currentIdx !== slideCount - 1) {
      this.moveSlide(currentIdx + 1);
    }
  };

  onInputNum1 = async (e) => {
    this.setState({
      num1: e.target.value,
    });
  };

  onInputNum2 = async (e) => {
    this.setState({
      num2: e.target.value,
    });
  };

  onInputNum3 = async (e) => {
    this.setState({
      num3: e.target.value,
    });
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

  sendTx = async (level) => {
    const { account } = this.state;

    const shopContract = new caver.klay.Contract(
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
          ],
          name: "useStone",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      shopCA
    );

    await shopContract.methods
      .useStone(account, level)
      .send({
        from: account,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        alert("거래 완료!");
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("교환이 취소되었습니다.");
      });

    this.setState({
      num1: "",
      num2: "",
      num3: "",
    });
  };

  sendTxNFT = async (level) => {
    const { account, currentIdx, num1, num2, num3 } = this.state;

    this.setState({
      num1: "",
      num2: "",
      num3: "",
    });

    const nftContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      nftCA
    );

    if (level == 0) {
      if (num1 == "") {
        alert("세포 값을 입력해주세요 :)");
        return;
      }
    } else if (level == 1) {
      if (num1 == "" || num2 == "") {
        alert("세포 값을 입력해주세요 :)");
        return;
      }
    } else if (level == 2) {
      if (num1 == "" || num2 == "" || num3 == "") {
        alert("세포 값을 입력해주세요 :)");
        return;
      }
    }

    console.log(level, " ", num1, " ", num2, " ", num3);
    const shopContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256[]",
              name: "_tokenIds",
              type: "uint256[]",
            },
            {
              internalType: "uint256",
              name: "_count",
              type: "uint256",
            },
          ],
          name: "useNFT",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      shopCA
    );

    const tokenArray = [];
    if (level == 0) {
      tokenArray.push(num1);
    } else if (level == 1) {
      tokenArray.push(num1);
      tokenArray.push(num2);
    } else if (level == 2) {
      tokenArray.push(num1);
      tokenArray.push(num2);
      tokenArray.push(num3);
    } else {
      console.log("error");
    }

    await shopContract.methods
      .useNFT(tokenArray, level + 1)
      .send({
        from: account,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        alert("거래 완료!");
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("교환이 취소되었습니다.");
      });
  };

  render() {
    const {
      account,
      balanceNFT,
      balanceStone,
      isLoading,
      currentIdx,
      num1,
      num2,
      num3,
    } = this.state;
    const sell_item = ["곡괭이 교환", "열쇠 교환"];

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
              <div className="KeplerShopPage__table">
                <div className="table_title">
                  <img src="images/shop/box_title.png" />
                </div>
                {currentIdx == 0 ? (
                  <div className="table_contents">
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img src="images/shop/faded_stone.png" />
                        </li>
                        <li>
                          <h2>X</h2>
                        </li>
                        <li>
                          <h1>10</h1>
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img src="images/shop/normal_pickaxe.png" />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTx(0)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img src="images/shop/faded_stone.png" />
                        </li>
                        <li>
                          <h2>X</h2>
                        </li>
                        <li>
                          <h1>20</h1>
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img src="images/shop/rare_pickaxe.png" />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTx(1)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img src="images/shop/faded_stone.png" />
                        </li>
                        <li>
                          <h2>X</h2>
                        </li>
                        <li>
                          <h1>30</h1>
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img src="images/shop/unique_pickaxe.png" />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTx(2)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                    </div>
                    <div className="item_count">
                      <label>남은 빛바랜 스톤 갯수</label>
                      <label>{balanceStone}</label>
                    </div>
                  </div>
                ) : null}
                {currentIdx == 1 ? (
                  <div className="table_contents">
                    <div className="items">
                      <ul className="item">
                        <li>
                          <input
                            type="text"
                            placeholder="세포 번호 입력"
                            onChange={this.onInputNum1}
                            value={num1}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/normal_key.png"
                            className="item_bg"
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxNFT(0)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <div>
                          <li>
                            <input
                              type="text"
                              placeholder="세포 번호 입력"
                              onChange={this.onInputNum1}
                              value={num1}
                            />
                          </li>
                          <li>
                            <input
                              type="text"
                              placeholder="세포 번호 입력"
                              onChange={this.onInputNum2}
                              value={num2}
                            />
                          </li>
                        </div>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/rare_key.png"
                            className="item_bg"
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxNFT(1)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li>
                          <li>
                            <input
                              type="text"
                              placeholder="세포 번호 입력"
                              onChange={this.onInputNum1}
                              value={num1}
                            />
                          </li>
                          <li>
                            <input
                              type="text"
                              placeholder="세포 번호 입력"
                              onChange={this.onInputNum2}
                              value={num2}
                            />
                          </li>
                          <li>
                            <input
                              type="text"
                              placeholder="세포 번호 입력"
                              onChange={this.onInputNum3}
                              value={num3}
                            />
                          </li>
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/unique_key.png"
                            className="item_bg"
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxNFT(2)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                    </div>
                    <div className="item_count">
                      <label>남은 NFT 갯수</label>
                      <label>{balanceNFT}</label>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="table_changer">
                <span className="prev" onClick={this.prevSlide}>
                  <img src="images/shop/left.png" />
                </span>
                <p>{sell_item[currentIdx]}</p>
                <span className="next" onClick={this.nextSlide}>
                  <img src="images/shop/right.png" />
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
