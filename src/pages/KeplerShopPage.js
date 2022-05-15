import React, { Component, useRef } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
import fetch from "node-fetch";

import Layout from "../components/Layout";
import Nav from "components/Nav";
import Modal from "components/ModalNFT";

import "./KeplerShopPage.scss";

const itemCA = "0x31756CAa3363516C01843F96f6AA7d9c922163b3";
const shopCA = "0xf5996a159872e016472756a7723915EEdC357f58";
const shopPotionCA = "0xA8B43d92754f42E16012207bc6368Ede70FC4615";

class KeplerShopPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      balanceNFT: 0,
      balanceStone: 0,
      isLoading: true,
      currentIdx: 0,
      currentPotionIdx: 0,
      level: 0,
      num1: "",
      num2: "",
      num3: "",
      urls: [],
      txHash: "",
      receipt: false,
      error: false,
      modalOpen: false,
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.setNetworkInfo();
    this.loadAccountInfo();
    // this.setOwn = setInterval(() => this.loadAccountInfo(), 1000);
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
    const balanceNFT = await keplerContract.methods.balanceOf(account).call();
    const balanceStone = await itemContract.methods
      .balanceOf(account, 35)
      .call();

    this.setState({
      account,
      balance: caver.utils.fromPeb(balance, "KLAY"),
      balanceNFT,
      balanceStone,
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

    const balanceNFT = await keplerContract.methods.balanceOf(account).call();
    const balanceStone = await itemContract.methods
      .balanceOf(account, 35)
      .call();

    this.setState({
      balanceNFT: [...balanceNFT],
      balanceStone: [...balanceStone],
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
    const slideCount = 3;
    if (currentIdx !== slideCount - 1) {
      this.moveSlide(currentIdx + 1);
    }
  };

  movePotionSlide = (num) => {
    const { currentPotionIdx } = this.state;
    this.setState({ currentPotionIdx: num });
  };

  prevPotionSlide = () => {
    const { currentPotionIdx } = this.state;
    if (currentPotionIdx !== 0) {
      this.movePotionSlide(currentPotionIdx - 1);
    }
  };

  nextPotionSlide = () => {
    const { currentPotionIdx } = this.state;
    const slideCount = 5;
    if (currentPotionIdx !== slideCount - 1) {
      this.movePotionSlide(currentPotionIdx + 1);
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

  sendTx = async (level) => {
    const { account, balance } = this.state;

    if (balance < 6) {
      alert("6 Klay 이상 소유해야 합니다 :)");
      return;
    }

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
        this.setBalance();
        alert("스톤 거래 완료!");
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("교환이 취소되었습니다.");
      });
  };

  sendTxUp = async (level) => {
    const { account, balance, currentPotionIdx } = this.state;

    if (balance < 6) {
      alert("6 Klay 이상 소유해야 합니다 :)");
      return;
    }

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
          name: "upPotion",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      shopPotionCA
    );

    await shopContract.methods
      .upPotion(account, currentPotionIdx + level)
      .send({
        from: account,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        this.setBalance();
        alert("포션 업그레이드 완료!");
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("교환이 취소되었습니다.");
      });
  };

  sendTxMix = async (level) => {
    const { account, balance, currentPotionIdx } = this.state;

    if (balance < 6) {
      alert("6 Klay 이상 소유해야 합니다 :)");
      return;
    }

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
          name: "mixPotion",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      shopPotionCA
    );

    await shopContract.methods
      .mixPotion(account, currentPotionIdx + level)
      .send({
        from: account,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        this.setBalance();
        alert("포션 믹스 완료!");
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("교환이 취소되었습니다.");
      });
  };

  sendTxNFT = async (level) => {
    const { account, num1, num2, num3 } = this.state;

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
        this.setBalance();
        alert("열쇠 거래 완료!");
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("교환이 취소되었습니다.");
      });

    this.setState({
      modalOpen: false,
      num1: "",
      num2: "",
      num3: "",
    });
  };

  setURI = async (array) => {
    const promises = [];
    const urls = [];

    const len = array.length;
    for (let id = 0; id < len; id++) {
      const promise = async (index) => {
        const res = await fetch(array[index]);
        const posts = await res.json();
        console.log(posts.image);

        urls.push(posts.image);
        // try {
        // } catch {
        //   urls.push(
        //     "https://ipfs.infura.io/ipfs/QmTCKV9yQ5nEtag4gijjQYUB9zNQ3PmM7vyoSKFiezt8ki"
        //   );
        // }
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    return urls;
  };

  setOpen = async (level) => {
    const { account, balance, num1, num2, num3 } = this.state;

    if (balance < 6) {
      alert("6 Klay 이상 소유해야 합니다 :)");
      return;
    }

    // Get DATE
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    console.log(hour, " ", minute);
    if (hour == 20 || hour == 21) {
      if (hour == 20) {
        alert("매일 20:00 ~ 21:30은 상점 점검 시간입니다 (진화 안정)");
        return;
      } else if (hour == 21 && minute <= 30) {
        alert("매일 20:00 ~ 21:30은 상점 점검 시간입니다 (진화 안정)");
        return;
      }
    }

    const addr = account.toUpperCase();
    const ipfs = [];
    if (level == 0) {
      if (num1 == "") {
        alert("NFT 값을 입력해주세요 :)");
        return;
      }
      let own = await keplerContract.methods.ownerOf(num1).call();

      own = own.toUpperCase();

      if (addr != own) {
        alert(`${num1}번 NFT의 소유주가 아닙니다.`);
        this.setState({
          num1: "",
        });
        return;
      }

      let url = await keplerContract.methods.tokenURI(num1).call();
      ipfs.push(url);
    } else if (level == 1) {
      if (num1 == "" || num2 == "") {
        alert("NFT 값을 입력해주세요 :)");
        return;
      }

      let own = await keplerContract.methods.ownerOf(num1).call();

      own = own.toUpperCase();

      if (addr != own) {
        alert(`${num1}번 NFT의 소유주가 아닙니다.`);
        this.setState({
          num1: "",
          num2: "",
        });
        return;
      }

      own = await keplerContract.methods.ownerOf(num2).call();

      own = own.toUpperCase();

      if (addr != own) {
        alert(`${num2}번 NFT의 소유주가 아닙니다.`);
        this.setState({
          num1: "",
          num2: "",
        });
        return;
      }

      let url = await keplerContract.methods.tokenURI(num1).call();
      ipfs.push(url);
      url = await keplerContract.methods.tokenURI(num2).call();
      ipfs.push(url);
    } else if (level == 2) {
      if (num1 == "" || num2 == "" || num3 == "") {
        alert("NFT 값을 입력해주세요 :)");
        return;
      }

      let own = await keplerContract.methods.ownerOf(num1).call();

      own = own.toUpperCase();

      if (addr != own) {
        alert(`${num1}번 NFT의 소유주가 아닙니다.`);
        this.setState({
          num1: "",
          num2: "",
          num3: "",
        });
        return;
      }

      own = await keplerContract.methods.ownerOf(num2).call();

      own = own.toUpperCase();

      if (addr != own) {
        alert(`${num2}번 NFT의 소유주가 아닙니다.`);
        this.setState({
          num1: "",
          num2: "",
          num3: "",
        });
        return;
      }

      own = await keplerContract.methods.ownerOf(num3).call();

      own = own.toUpperCase();

      if (addr != own) {
        alert(`${num3}번 NFT의 소유주가 아닙니다.`);
        this.setState({
          num1: "",
          num2: "",
          num3: "",
        });
        return;
      }

      let url = await keplerContract.methods.tokenURI(num1).call();
      ipfs.push(url);
      url = await keplerContract.methods.tokenURI(num2).call();
      ipfs.push(url);
      url = await keplerContract.methods.tokenURI(num3).call();
      ipfs.push(url);
    }

    const urls = await this.setURI(ipfs);
    console.log(urls);
    this.setState({
      level,
      urls,
      modalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      num1: "",
      num2: "",
      num3: "",
      modalOpen: false,
    });
  };

  render() {
    const {
      account,
      balanceNFT,
      balanceStone,
      isLoading,
      currentIdx,
      currentPotionIdx,
      level,
      num1,
      num2,
      num3,
      urls,
      modalOpen,
    } = this.state;
    const sell_item = ["곡괭이 교환", "열쇠 교환", "포션 교환"];

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

                      <div className="item_m" onClick={(e) => this.sendTx(0)}>
                        <p>교환</p>
                      </div>
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

                      <div className="item_m" onClick={(e) => this.sendTx(1)}>
                        <p>교환</p>
                      </div>
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

                      <div className="item_m" onClick={(e) => this.sendTx(2)}>
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="item_count">
                      <p>남은 빛바랜 스톤 갯수</p>
                      <p>{balanceStone}</p>
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
                            placeholder="번호 기입"
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
                          onClick={(e) => this.setOpen(0)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                      <div className="item_m" onClick={(e) => this.setOpen(0)}>
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <div>
                          <li>
                            <input
                              type="text"
                              placeholder="번호 기입"
                              onChange={this.onInputNum1}
                              value={num1}
                            />
                          </li>
                          <li>
                            <input
                              type="text"
                              placeholder="번호 기입"
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
                          onClick={(e) => this.setOpen(1)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                      <div className="item_m" onClick={(e) => this.setOpen(1)}>
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li>
                          <li>
                            <input
                              type="text"
                              placeholder="번호 기입"
                              onChange={this.onInputNum1}
                              value={num1}
                            />
                          </li>
                          <li>
                            <input
                              type="text"
                              placeholder="번호 기입"
                              onChange={this.onInputNum2}
                              value={num2}
                            />
                          </li>
                          <li>
                            <input
                              type="text"
                              placeholder="번호 기입"
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
                          onClick={(e) => this.setOpen(2)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>
                      <div className="item_m" onClick={(e) => this.setOpen(2)}>
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="item_count">
                      <p>남은 NFT 갯수</p>
                      <p>{balanceNFT}</p>
                    </div>
                  </div>
                ) : null}
                {currentIdx == 2 && currentPotionIdx != 4 ? (
                  <div className="table_contents">
                    <div className="items">
                      <div className="another">
                        <p>현재 보고 있는 종</p>
                        <div className="current_type">
                          <span className="prev" onClick={this.prevPotionSlide}>
                            <img src="images/shop/left.png" />
                          </span>
                          <p>{currentPotionIdx + 1} 종</p>
                          <span className="next" onClick={this.nextPotionSlide}>
                            <img src="images/shop/right.png" />
                          </span>
                        </div>
                      </div>
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}S.png`}
                          />
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
                          <img
                            src={`images/items/${currentPotionIdx + 1}M.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxUp(20)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxUp(20)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}M.png`}
                          />
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
                          <img
                            src={`images/items/${currentPotionIdx + 1}L.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxUp(10)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxUp(10)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}S.png`}
                          />
                        </li>
                        <li>
                          <h2>+</h2>
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 2}S.png`}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 6}S.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxMix(20)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxMix(20)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}M.png`}
                          />
                        </li>
                        <li>
                          <h2>+</h2>
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 2}M.png`}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 6}M.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxMix(10)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxMix(10)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}L.png`}
                          />
                        </li>
                        <li>
                          <h2>+</h2>
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 2}L.png`}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 6}L.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxMix(0)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxMix(0)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {currentIdx == 2 && currentPotionIdx == 4 ? (
                  <div className="table_contents">
                    <div className="items">
                      <div className="another">
                        <p>현재 보고 있는 종</p>
                        <div className="current_type">
                          <span className="prev" onClick={this.prevPotionSlide}>
                            <img src="images/shop/left.png" />
                          </span>
                          <p>{currentPotionIdx + 1} 종</p>
                          <span className="next" onClick={this.nextPotionSlide}>
                            <img src="images/shop/right.png" />
                          </span>
                        </div>
                      </div>
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}S.png`}
                          />
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
                          <img
                            src={`images/items/${currentPotionIdx + 1}M.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxUp(20)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxUp(20)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}M.png`}
                          />
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
                          <img
                            src={`images/items/${currentPotionIdx + 1}L.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxUp(10)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxUp(10)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}S.png`}
                          />
                        </li>
                        <li>
                          <h2>+</h2>
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx - 3}S.png`}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 6}S.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxMix(20)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxMix(20)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}M.png`}
                          />
                        </li>
                        <li>
                          <h2>+</h2>
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx - 3}M.png`}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 6}M.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxMix(10)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxMix(10)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                    <div className="items">
                      <ul className="item">
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 1}L.png`}
                          />
                        </li>
                        <li>
                          <h2>+</h2>
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx - 3}L.png`}
                          />
                        </li>
                        <li>
                          <img
                            src="images/shop/after.png"
                            className="item_arrow"
                          />
                        </li>
                        <li className="item_bg">
                          <img
                            src={`images/items/${currentPotionIdx + 6}L.png`}
                          />
                        </li>
                        <div
                          className="item_border"
                          onClick={(e) => this.sendTxMix(0)}
                        >
                          <p>교환</p>
                        </div>
                      </ul>

                      <div
                        className="item_m"
                        onClick={(e) => this.sendTxMix(0)}
                      >
                        <p>교환</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <Modal
                  open={modalOpen}
                  num1={num1}
                  num2={num2}
                  num3={num3}
                  urls={urls}
                  tx={(e) => this.sendTxNFT(level)}
                  close={this.closeModal}
                />
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
                </p>
                <p>(최대 가스비 인상 때문)</p>
              </div>
              <div className="check">
                <p>매일 20:30 ~ 21:30은 열쇠 거래가 제한됩니다</p>
                <p>(진화 안정성 때문)</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerShopPage;
