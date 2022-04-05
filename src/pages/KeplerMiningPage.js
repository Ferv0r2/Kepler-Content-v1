import React, { Component, useRef } from "react";
import caver from "klaytn/caver";
// import fetch from "node-fetch";

import Layout from "../components/Layout";
import Nav from "components/Nav";
import ModalMining from "components/ModalMining";

import "./KeplerMiningPage.scss";

const miningCA = "0x990ecFbd68Bb1a0061A963F6Ff56495ce64352a9";
const itemCA = "0x0Eb6d62Fd1C550Cf846A73FC9855c2352BB9b012";
// const miningCA = "0xc9eF79f42453211cB462fa4934B28166f8BB1E2E";
// const itemCA = "0x31756CAa3363516C01843F96f6AA7d9c922163b3";

class KeplerMiningPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      isLoading: true,
      currentIdx: 0,
      limit: 0,
      gachaItem: 0,
      destroy: 0,
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
    const balance = await itemContract.methods.balanceOf(account, 36).call();

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
    this.ref.current.style.left = -num * 650 + "px";
    this.setState({
      currentIdx: num,
    });
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

    const balance = await itemContract.methods
      .balanceOf(account, idx + 36)
      .call();
    this.setState({
      balance,
    });
  };

  gachaId = async () => {
    const { currentIdx } = this.state;

    let pointer = 35;
    let status = 0;

    const destruct = Math.random() * 100; // 0 ~ 99 실수

    const itemGacha = Math.random() * 100; // 0 ~ 99 실수
    const itemNum = Math.floor(Math.random() * 5) + 30; // 0 ~ 4

    console.log(itemGacha);

    if (currentIdx == 2) {
      if (destruct < 40) {
        status = 1;
      }
      if (itemGacha < 60) {
        pointer = itemNum;
      }
    } else if (currentIdx == 1) {
      if (destruct < 55) {
        status = 1;
      }
      if (itemGacha < 40) {
        pointer = itemNum;
      }
    } else if (currentIdx == 0) {
      if (destruct < 70) {
        status = 1;
      }
      if (itemGacha < 90) {
        pointer = itemNum;
      }
    } else {
      console.log("error");
    }

    this.setState({
      gachaItem: pointer,
      destroy: status,
    });
    return pointer;
  };

  sendTxItem = async () => {
    const { account, currentIdx } = this.state;
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
              name: "_mixId",
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

    const num = await this.gachaId();
    console.log(account);
    console.log(currentIdx);
    console.log(num);

    await miningContract.methods
      .mining(account, currentIdx, num)
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
        this.setState({
          receipt: JSON.stringify(receipt),
          modalOpen: true,
        });
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("믹스스톤 채굴이 취소되었습니다.");
        this.setState({ error: error.message });
      });
    // this.setState({
    //   modalOpen: true,
    // });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const {
      account,
      balance,
      isLoading,
      currentIdx,
      destroy,
      gachaItem,
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
                <p>믹스스톤 채굴</p>
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
                    gachaItem={gachaItem}
                    destroy={destroy}
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
                  <p>남은 수량 : {balance} 개</p>
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
