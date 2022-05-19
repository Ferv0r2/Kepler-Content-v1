import React, { Component } from "react";
import { Link, useHistory } from "react-router-dom";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import Layout from "../components/Layout";
import Nav from "components/Nav";

import "./KeplerGovernancePage.scss";
import { data } from "jquery";

const ipfs = "https://ipfs.infura.io/ipfs/";
const govCA = "0x336511B5505935d7edB3CbC04a50C7fEc06caFe2";

class KeplerGovernancePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      network: null,
      isLoading: true,
      tokenURI: "",
      proposalCount: 0,
      proposals: [],
      agree: 0,
      degree: 0,
      result: "",
      blockNumber: 0,
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
    const balance = await keplerContract.methods.balanceOf(account).call();

    this.setState({
      account,
      balance: balance,
    });
  };

  // setBlockNumber = async () => {
  //   const { proposal } = this.state;
  //   const bn = await caver.klay.getBlockNumber();
  //   let time =
  //     parseInt(proposal.blockNumber) + parseInt(proposal.votePeriod) - bn;

  //   if (time <= 0) time = 0;
  //   this.setState({
  //     blockNumber: time,
  //   });
  // };

  setProposal = async () => {
    const govContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [],
          name: "proposalCount",
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
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "proposals",
          outputs: [
            {
              internalType: "address",
              name: "proposer",
              type: "address",
            },
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "summary",
              type: "string",
            },
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "blockNumber",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "proposenft",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "votePeriod",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "canceled",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      govCA
    );

    const proposals = [];
    const proposalCount = await govContract.methods.proposalCount().call();

    for (let i = 0; i < proposalCount; i++) {
      const proposal = await govContract.methods.proposals(i).call();
      proposals.push(proposal);
    }
    this.setState({
      proposalCount,
      proposals,
      // isLoading: false,
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

  render() {
    const { account, isLoading, proposalCount, proposals } = this.state;
    // const ids = [1, 2];

    const ids = proposals.map((k, v) => <li>{k}</li>);

    console.log(proposals);
    console.log(ids);
    return (
      <Layout>
        <div className="KeplerGovernancePage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerGovernancePage__header">
            <div className="KeplerGovernanacePage__title">
              <h3>Kepler-452b</h3>
              <h2>GOVERNANCE</h2>
            </div>
            <img src="images/governance/gove_icon.png" />
          </div>
          <div className="KeplerGovernancePage__proposal">
            <div className="btn_proposal">
              <Link to="/proposal">제안 작성하기</Link>
            </div>
          </div>
          <div className="KeplerGovernancePage__main">
            <div className="KeplerGovernancePage__infoBox">
              <p>
                케플러 식물 NFT를 소유중이라면 투표를 진행하고 제안을 작성할 수
                있습니다.
              </p>
              <p>
                더 나은 Kepler-452b 프로젝트를 위해 여러분의 의견을 보여주세요
              </p>
            </div>
            <div className="KeplerGovernancePage__contents">
              <div className="KeplerProposalList__title">LIST</div>
              <div className="List__contents">
                <div className="List__proposals">
                  <div className="List__numbers">
                    <ul>
                      {ids}
                      {/* <li>2</li>
                      <li>1</li> */}
                    </ul>
                  </div>
                  <div className="List__titles">
                    <ul>
                      <li>
                        <Link to={`/governance/${ids[1]}`}>
                          인스타툰 골닷님 고정 출현
                        </Link>
                      </li>
                      <li>
                        <Link to={`/governance/${ids[0]}`}>
                          Kepler-452b 프로젝트 거버넌스 홈페이지 안내문
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="List__result">
                    <ul>
                      <li>투표중</li>
                      <li>찬성</li>
                    </ul>
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

export default KeplerGovernancePage;
