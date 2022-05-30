import React, { Component, useRef } from "react";
import caver from "klaytn/caver";

import Layout from "components/Layout";
import Nav from "components/Nav";
import Modal from "components/Modal";

import items from "./item.json";

import "./KeplerBoxPage.scss";

const mintCA = "0xa72336cBb31af6e85AB1a816753aC9Ec38Cd95B5";
const itemCA = "0x31756CAa3363516C01843F96f6AA7d9c922163b3";

class KeplerBoxPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      key1: 0,
      key2: 0,
      key3: 0,
      isLoading: true,
      currentIdx: 0,
      gachaItem: 0,
      modalOpen: false,
      txHash: "",
      receipt: false,
      error: false,
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.setNetworkInfo();
    this.loadAccountInfo();
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
    const balance = await caver.klay.getBalance(account);
    const key1 = await itemContract.methods.balanceOf(account, 39).call();
    const key2 = await itemContract.methods.balanceOf(account, 40).call();
    const key3 = await itemContract.methods.balanceOf(account, 41).call();

    this.setState({
      account,
      balance: caver.utils.fromPeb(balance, "KLAY"),
      key1,
      key2,
      key3,
      isLoading: false,
    });
  };

  setBalance = async () => {
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

    const key1 = await itemContract.methods.balanceOf(account, 39).call();
    const key2 = await itemContract.methods.balanceOf(account, 40).call();
    const key3 = await itemContract.methods.balanceOf(account, 41).call();

    this.setState({
      key1: [...key1],
      key2: [...key2],
      key3: [...key3],
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
    }
  };

  nextSlide = () => {
    const { currentIdx } = this.state;
    const slideCount = 3;
    if (currentIdx !== slideCount - 1) {
      this.moveSlide(currentIdx + 1);
    }
  };

  gachaId = async () => {
    const { currentIdx } = this.state;

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

    return pointer;
  };

  sendTxItem = async () => {
    const { account, balance, currentIdx, key1, key2, key3 } = this.state;

    if (balance < 2) {
      alert("2 Klay 이상 소유해야 합니다 :)");
      return;
    }

    if (currentIdx == 0 && key1 == 0) {
      alert("일반 열쇠가 없습니다.");
      return;
    } else if (currentIdx == 1 && key2 == 0) {
      alert("레어 열쇠가 없습니다.");
      return;
    } else if (currentIdx == 2 && key3 == 0) {
      alert("유니크 열쇠가 없습니다.");
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
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "useKey",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      mintCA
    );

    const num = await this.gachaId();

    await minterContract.methods
      .useKey(account, currentIdx, num)
      .send({
        from: account,
        gas: 2500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        this.setBalance();
        this.setState({ gachaItem: num });
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("상자깡이 취소되었습니다.");
      });
  };

  sendTxKey = async () => {
    const { account, currentIdx, balance } = this.state;

    if (balance < 2) {
      alert("2 Klay 이상 소유해야 합니다 :)");
      return;
    }
    const minterContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "_id",
              type: "uint256",
            },
          ],
          name: "mintItem",
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
          name: "gacha",
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

    const payer = await minterContract.methods
      .payers(currentIdx, account)
      .call();

    if (!payer) await this.sendTxItem();
    const gacha = await minterContract.methods
      .gacha(currentIdx, account)
      .call();

    console.log(gacha);

    await new Promise((resolve) => {
      setTimeout(async () => {
        await minterContract.methods
          .mintItem(currentIdx)
          .send({
            from: account,
            gas: 2500000,
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
              gachaItem: gacha,
            });
          })
          .on("error", (error) => {
            console.log("error", error);
            alert("상자깡이 취소되었습니다.");
            this.setState({ error: error.message });
          });
        resolve();
      }, 200);
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  render() {
    const {
      account,
      key1,
      key2,
      key3,
      isLoading,
      currentIdx,
      gachaItem,
      modalOpen,
    } = this.state;
    const boxs = ["Normal Box", "Rare Box", "Unique Box"];

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
                <div className="mint_item">
                  <div className="mint_btn" onClick={this.sendTxKey}>
                    OPEN BOX
                  </div>
                </div>
              </div>
              <div className="KeplerBoxPage__payable">
                <div className="key_balance">
                  <label>Normal Key</label>
                  <p>
                    <img src={`images/items/K1.png`} />
                    {key1}
                  </p>
                </div>
                <div className="key_balance">
                  <label>Rare Key</label>
                  <p>
                    <img src={`images/items/K2.png`} />
                    {key2}
                  </p>
                </div>
                <div className="key_balance">
                  <label>Unique Key</label>
                  <p>
                    <img src={`images/items/K3.png`} />
                    {key3}
                  </p>
                </div>
              </div>
              <div className="check">
                <p>트랜잭션은 2번 발생합니다 (예상 수수료 예측 때문)</p>
                <p>
                  2 Klay 이상 소유해야 트랜잭션이 에러를 발생시키지 않습니다
                  (최대 가스비 인상 때문)
                </p>
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
