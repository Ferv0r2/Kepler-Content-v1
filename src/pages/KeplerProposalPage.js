import React, { Component } from "react";
import { Link } from "react-router-dom";

import Layout from "components/Layout";
import Nav from "components/Nav";

import "./KeplerProposalPage.scss";

const ownerA = "0x33365F518A0F333365b7FF53BEAbf1F5b1247b5C";
const nftCA = "0x928267E7dB3d173898553Ff593A78719Bb16929F";
const govCA = "0x71296B11a5E298d65B6cA395c469e7b5A908B5c4";
const kluCA = "0x75dcAA3eb2403c7725Cc8e5E38f6949eBaB28aCC";
const burnerCA = "0x571110c0FFc5cC3B325C2bc13355E0Aab422836F";
class KeplerProposalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      isLoading: true,
      title: "",
      period: "",
      content: "",
      summary: "",
    };
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

    const kluContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "account",
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
      kluCA
    );

    const account = klaytn.selectedAddress;
    const kluBalance = await kluContract.methods.balanceOf(account).call();
    const balance = String((kluBalance / 1000000000000000000).toFixed(4));
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

  onEventTitleChange = async (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  onEventPeriodChange = async (e) => {
    this.setState({
      period: e.target.value,
    });
  };

  onEventContentChange = async (e) => {
    this.setState({
      content: e.target.value,
    });
  };

  onEventSummaryChange = async (e) => {
    this.setState({
      summary: e.target.value,
    });
  };

  signTransaction = async () => {
    const { account, balance, title, period, content, summary } = this.state;

    if (title == "") {
      alert("제목을 입력해 주세요");
      return;
    } else if (period == "") {
      alert("투표 기간을 입력해 주세요");
      return;
    } else if (content == "") {
      alert("세부 내용을 입력해 주세요");
      return;
    } else if (summary == "") {
      alert("요약을 입력해 주세요");
      return;
    }

    const per = parseInt(period);
    if (per < 86400 || per > 604800) {
      alert("투표 기간을 재설정해 주세요");
      this.setState({
        period: "",
      });
      return;
    }

    const govContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "string",
              name: "_title",
              type: "string",
            },
            {
              internalType: "string",
              name: "_summary",
              type: "string",
            },
            {
              internalType: "string",
              name: "_content",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_votePeriod",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "_nft",
              type: "address",
            },
          ],
          name: "propose",
          outputs: [
            {
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "proposePrice",
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
      govCA
    );

    const kluContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
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
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      kluCA
    );

    console.log(title);
    console.log(period);
    console.log(content);
    console.log(summary);

    const proposePrice = await govContract.methods.proposePrice().call();
    if (balance < proposePrice / 1000000000000000000) {
      alert(`KLU가 부족합니다 : ${balance}`);
      return;
    }

    const allow = await kluContract.methods.allowance(ownerA, govCA).call();
    if (allow) {
      await kluContract.methods
        .approve(burnerCA, proposePrice)
        .send({
          from: account,
          gas: 2500000,
        })
        .then((res) => console.log(res))
        .catch((err) => {
          console.log("error", err);
          alert("클루 토큰 사용이 취소되었습니다.");
          return;
        });
    } else {
      alert(
        "에러 발생! 다시 시도해주세요.\n 반복된다면 개발자에게 1:1 메시지를 남겨주세요!"
      );
      return;
    }

    await govContract.methods
      .propose(title, summary, content, period, nftCA)
      .send({
        from: account,
        gas: 7500000,
      })
      .then((res) => {
        console.log(res);
        alert("제안이 정상적으로 완료되었습니다.");
        this.setState({
          title: "",
          period: "",
          content: "",
          summary: "",
        });
        window.location.replace("/#/governance");
      })
      .catch((err) => {
        console.log("error", err);
        alert("제안 중에 에러가 발생하였습니다.");
      });
  };

  render() {
    const { account, isLoading } = this.state;
    return (
      <Layout>
        <div className="KeplerProposalPage">
          <Nav address={account} load={isLoading} />
          <div className="container">
            <div className="KeplerProposalPage__before">
              <Link to="/governance">
                <div className="prev">
                  <img src="../images/governance/goback.png" />
                  <p>목록으로 돌아가기</p>
                </div>
              </Link>
            </div>
            <div className="KeplerProposalPage__contents">
              <div className="KeplerProposalPage__title">제안 작성하기</div>
              <form>
                <div className="mb-3">
                  <label htmlFor="gove-title" className="form-label">
                    제목
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={this.onEventTitleChange}
                    placeholder="50자 이내로 입력해 주세요."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gove-period" className="form-label">
                    투표 기간
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={this.onEventPeriodChange}
                    placeholder="86400(하루) ~ 604800(일주일) 사이로 입력해주세요."
                  />
                </div>
                <p>
                  투표 기간은 블록넘버로 작성해야 합니다. =>
                  <a href="https://scope.klaytn.com/"> [ 클레이스코프 ]</a>
                </p>
                <div className="mb-3 detail">
                  <label htmlFor="gove-contents" className="form-label">
                    세부 내용
                  </label>
                  <textarea
                    type="text"
                    className="form-control gove-contents"
                    onChange={this.onEventContentChange}
                    placeholder="여러 이슈를 대비해서 꼭 메모장 등에 먼저 작성해주세요."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gove-summary" className="form-label">
                    요약
                  </label>
                  <textarea
                    type="text"
                    className="form-control gove-summary"
                    onChange={this.onEventSummaryChange}
                    placeholder="간단한 3줄 요약, 하고 싶은 말 등 무엇이든 환영입니다."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    제안자
                  </label>
                  <p id="account">{account}</p>
                </div>

                <div
                  type="submit"
                  className="btn-suggest"
                  onClick={this.signTransaction}
                >
                  완료하기
                </div>
                <p>* 제안에는 100 클루가 소각됩니다. </p>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerProposalPage;
