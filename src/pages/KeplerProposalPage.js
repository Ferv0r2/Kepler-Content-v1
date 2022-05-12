import React, { Component } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Nav from "components/Nav";
import nftContract from "../klaytn/KeplerContract";

import "./KeplerProposalPage.scss";

class KeplerProposalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      isLoading: true,
      title: "",
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

    const account = klaytn.selectedAddress;
    this.setState({
      account,
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

  // signTransaction = async () => {
  //   const { title, content, summary } = this.state;
  //   const { address } = this.props;

  //   const govContract = new caver.klay.Contract(
  //     [
  //       {
  //         constant: false,
  //         inputs: [
  //           {
  //             internalType: "string",
  //             name: "title",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "summary",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "content",
  //             type: "string",
  //           },
  //           {
  //             internalType: "string",
  //             name: "note",
  //             type: "string",
  //           },
  //           {
  //             internalType: "uint256",
  //             name: "votePeriod",
  //             type: "uint256",
  //           },
  //           {
  //             internalType: "address",
  //             name: "_nft",
  //             type: "address",
  //           },
  //           {
  //             internalType: "uint256[]",
  //             name: "keplerIds",
  //             type: "uint256[]",
  //           },
  //         ],
  //         name: "propose",
  //         outputs: [
  //           {
  //             internalType: "uint256",
  //             name: "proposalId",
  //             type: "uint256",
  //           },
  //         ],
  //         payable: false,
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //     ],
  //     govCA
  //   );

  //   const suggestArray = [];

  //   // for문으로 여러개 O
  //   const suggestToken = await nftContract.methods
  //     .tokenOfOwnerByIndex(address, 0)
  //     .call();

  //   suggestArray.push(suggestToken);

  //   console.log(title);
  //   console.log(content);
  //   console.log(summary);
  //   console.log(suggestArray);

  //   const sendTx = await govContract.methods
  //     .propose(title, summary, content, "", 86400, nftCA, suggestArray)
  //     .send({
  //       from: address,
  //       gas: 7500000,
  //     })
  //     .on("transactionHash", (transactionHash) => {
  //       console.log("txHash", transactionHash);
  //       this.setState({ txHash: transactionHash });
  //     })
  //     .on("receipt", (receipt) => {
  //       console.log("receipt", receipt);
  //       alert("신청이 정상적으로 완료되었습니다.");
  //       this.setState({ receipt: JSON.stringify(receipt) });
  //     })
  //     .on("error", (error) => {
  //       console.log("error", error);
  //       alert("신청 에러.");
  //       this.setState({ error: error.message });
  //     });
  // };

  render() {
    const { account, isLoading } = this.state;
    return (
      <Layout>
        <div className="KeplerProposalPage">
          <Nav address={account} />
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
                    id="gove-title"
                    aria-describedby="goveHelp"
                    onChange={this.onEventTitleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gove-contents" className="form-label">
                    세부 내용
                  </label>
                  <textarea
                    type="text"
                    className="form-control sugge-contents"
                    id="gove-contents"
                    onChange={this.onEventContentChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gove-summary" className="form-label">
                    요약
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="gove-summary"
                    onChange={this.onEventSummaryChange}
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
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerProposalPage;
