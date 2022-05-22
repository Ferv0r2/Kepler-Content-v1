import React, { Component } from "react";
import { Link, useHistory } from "react-router-dom";
import caver from "klaytn/caver";
// import fetch from "node-fetch";

import Layout from "../components/Layout";
import Nav from "components/Nav";

import "./KeplerGovernancePage.scss";

const govCA = "0x8ee0Be3319D99E15EB7Ec69DF68b010948bb17B4";

class KeplerGovernancePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      network: null,
      isLoading: true,
      tokenURI: "",
      proposals: [],
      status: [],
      agree: 0,
      degree: 0,
      result: "",
    };
  }

  componentDidMount() {
    this.loadAccountInfo();
    this.setNetworkInfo();
    this.setProposal();
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
    });
  };

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
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
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
              name: "content",
              type: "string",
            },
            {
              internalType: "string",
              name: "summary",
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
        {
          constant: true,
          inputs: [
            {
              internalType: "uint256",
              name: "_proposalId",
              type: "uint256",
            },
          ],
          name: "status",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
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
    const status = [];
    const proposalCount = await govContract.methods.proposalCount().call();

    for (let i = 0; i < proposalCount; i++) {
      const proposal = await govContract.methods.proposals(i).call();
      proposals.push(proposal);

      const stat = await govContract.methods.status(i).call();
      status.push(stat);
    }

    this.setState({
      proposals,
      status,
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
    const { account, isLoading, proposals, status } = this.state;

    const result = ["투표중", "투표 완료", "투표 취소"];
    const ids = proposals.map((id) => (
      <li key={id.id}>
        <Link to={`/governance/${parseInt(id.id) + 1}`}>
          {parseInt(id.id) + 1}
        </Link>
      </li>
    ));
    const titles = proposals.map((id) => (
      <li key={id.id}>
        <Link to={`/governance/${parseInt(id.id) + 1}`}>{id.title}</Link>
      </li>
    ));

    const stats = status.map((stat, index) => (
      <li key={index}>{result[stat]}</li>
    ));

    return (
      <Layout>
        <div className="KeplerGovernancePage">
          <Nav address={account} load={isLoading} />
          <>
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
                  케플러 식물 NFT를 소유중이라면 투표를 진행하고 제안을 작성할
                  수 있습니다.
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
                      <ul>{ids}</ul>
                    </div>
                    <div className="List__titles">
                      <ul>{titles}</ul>
                    </div>
                    <div className="List__result">
                      <ul>{stats}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </Layout>
    );
  }
}

export default KeplerGovernancePage;
