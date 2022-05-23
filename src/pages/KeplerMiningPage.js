import React, { Component, useRef } from "react";
import caver from "klaytn/caver";
// import fetch from "node-fetch";

import Layout from "components/Layout";
import Nav from "components/Nav";
import ModalMining from "components/ModalMining";

import "./KeplerMiningPage.scss";

const miningCA = "0x9da24c77C9C2988338ab38Ae14376b6AD868601C";
const itemCA = "0x31756CAa3363516C01843F96f6AA7d9c922163b3";

class KeplerMiningPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      pickaxe: 0,
      isLoading: true,
      currentIdx: 0,
      gachaItems: 35,
      counter: 0,
      getBack: 0,
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
        this.setMintPrice(0);
        klaytn.on("accountsChanged", () => {
          this.setAccountInfo(klaytn);
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
    const balance = await caver.klay.getBalance(account);
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
    const pickaxe = await itemContract.methods.balanceOf(account, 36).call();

    this.setState({
      account,
      balance: caver.utils.fromPeb(balance, "KLAY"),
      pickaxe,
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
      this.setBalance(currentIdx - 1);
    }
  };

  nextSlide = () => {
    const { currentIdx } = this.state;
    const slideCount = 3;
    if (currentIdx !== slideCount - 1) {
      this.moveSlide(currentIdx + 1);
      this.setBalance(currentIdx + 1);
    }
  };

  setBalance = async (idx) => {
    const { account } = this.state;
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

    const pickaxe = await itemContract.methods
      .balanceOf(account, idx + 36)
      .call();
    this.setState({
      pickaxe,
    });
  };

  gachaId = async () => {
    const { currentIdx } = this.state;

    let pointer = 35;
    let counter = 0;
    let status = 1;

    const destruct = Math.random() * 100; // 0 ~ 99 실수

    const itemGacha = Math.random() * 100; // 0 ~ 99 실수
    const itemNum = Math.floor(Math.random() * 5) + 30; // 0 ~ 4

    console.log(itemGacha);

    if (currentIdx == 2) {
      if (destruct < 40) {
        status = 0;
      }
      if (itemGacha < 0.8) {
        pointer = itemNum;
        counter = 3;
      } else if (itemGacha < 10.4) {
        pointer = itemNum;
        counter = 2;
      } else if (itemGacha < 48.8) {
        pointer = itemNum;
        counter = 1;
      }
    } else if (currentIdx == 1) {
      if (destruct < 55) {
        status = 0;
      }
      if (itemGacha < 4) {
        pointer = itemNum;
        counter = 2;
      } else if (itemGacha < 32) {
        pointer = itemNum;
        counter = 1;
      }
    } else if (currentIdx == 0) {
      if (destruct < 70) {
        status = 0;
      }
      if (itemGacha < 20) {
        pointer = itemNum;
        counter = 1;
      }
    } else {
      console.log("error");
    }

    this.setState({
      getBack: status,
    });
    return [pointer, counter];
  };

  sendTxUse = async () => {
    const { account, currentIdx } = this.state;

    const num = await this.gachaId();
    const miningContract = new caver.klay.Contract(
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
              name: "_tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_count",
              type: "uint256",
            },
          ],
          name: "usePickaxe",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "gachas",
          outputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "counter",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      miningCA
    );

    await miningContract.methods
      .usePickaxe(account, currentIdx, num[0], num[1])
      .send({
        from: account,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("믹스스톤 채굴이 취소되었습니다.");
      });
  };

  sendTxItem = async () => {
    const { account, currentIdx, balance, pickaxe } = this.state;

    if (pickaxe == 0) {
      alert("곡괭이가 없습니다.");
      return;
    }

    if (balance < 6) {
      alert("6 Klay 이상 소유해야 합니다 :)");
      return;
    }

    const miningContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "gachas",
          outputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "counter",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "payers",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_getBackCount",
              type: "uint256",
            },
          ],
          name: "mining",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      miningCA
    );

    const payer = await miningContract.methods
      .payers(currentIdx, account)
      .call();

    if (!payer) await this.sendTxUse();

    const gacha = await miningContract.methods
      .gachas(currentIdx, account)
      .call();

    console.log(gacha);

    const { getBack } = this.state;

    await new Promise((resolve) => {
      setTimeout(async () => {
        await miningContract.methods
          .mining(currentIdx, getBack)
          .send({
            from: account,
            gas: 7500000,
          })
          .on("transactionHash", (transactionHash) => {
            console.log("txHash", transactionHash);
            this.setState({ txHash: transactionHash });
          })
          .on("receipt", (receipt) => {
            console.log("receipt", receipt);
            this.setBalance(currentIdx);
            this.setState({
              receipt: JSON.stringify(receipt),
              modalOpen: true,
              gachaItems: gacha[0],
              counter: gacha[1],
            });
          })
          .on("error", (error) => {
            console.log("error", error);
            alert("믹스스톤 채굴이 취소되었습니다.");
            this.setState({
              error: error.message,
            });
          });
        resolve();
      }, 200);
    });
  };

  closeModal = () => {
    const { getBack } = this.state;
    if (getBack == 1) {
      alert("곡괭이는 무사합니다!");
    } else {
      alert("믹스스톤을 캐던 중 곡괭이가 부서졌습니다..");
    }
    this.setState({
      modalOpen: false,
    });
  };

  render() {
    const {
      account,
      pickaxe,
      isLoading,
      currentIdx,
      gachaItems,
      counter,
      modalOpen,
    } = this.state;
    const boxs = ["하급 곡괭이", "중급 곡괭이", "상급 곡괭이"];

    return (
      <Layout>
        <div className="KeplerMiningPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerMiningPage__main">
            <div className="KeplerMiningPage__title">
              <img src="images/mining-title.png" />
            </div>
            <div className="KeplerMiningPage__contents">
              <div className="KeplerMiningPage__mining">
                <img src="video/mining.png" />
                <p>트랜잭션은 2번 발생합니다 (예상 수수료 예측 때문)</p>
                <p>
                  6 Klay 이상 소유해야 트랜잭션이 에러를 발생시키지 않습니다
                  (최대 가스비 인상 때문)
                </p>
              </div>

              <div className="KeplerMiningPage__mint">
                <div className="mint_btn" onClick={this.sendTxItem}>
                  START
                </div>
                <p>
                  아래에 가지고 있는 곡괭이를 선택 후 "START" 버튼을 눌러
                  믹스스톤을 채굴해주세요
                </p>
              </div>
              <div className="KeplerMiningPage__tools">
                <div id="slideShow">
                  <ul className="slides" ref={this.ref}>
                    <li>
                      <img src="images/items/1PK.png" />
                    </li>
                    <li>
                      <img src="images/items/2PK.png" />
                    </li>
                    <li>
                      <img src="images/items/3PK.png" />
                    </li>
                  </ul>
                  <ModalMining
                    open={modalOpen}
                    currentIdx={currentIdx}
                    gachaItems={gachaItems}
                    counter={counter}
                    close={this.closeModal}
                  />
                  <span className="prev">
                    <img
                      src="images/mining-left.png"
                      onClick={this.prevSlide}
                    />
                  </span>
                  <span className="next">
                    <img
                      src="images/mining-right.png"
                      onClick={this.nextSlide}
                    />
                  </span>
                </div>
                <div className="KeplerMiningPage__name">
                  <p>{boxs[currentIdx]}</p>
                </div>
                <div className="KeplerMiningPage__limit">
                  <p>남은 수량 : {pickaxe} 개</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerMiningPage;
