import React, { Component } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import Nav from "components/SubNav";
import Token from "components/Token";
import VoteProposal from "../components/VoteProposal";
import Footer from "components/Footer";

import "./KeplerGovernancePage.scss";

const ipfs = "https://ipfs.infura.io/ipfs/";
const govCA = "0xC423E1f75C3676AE3b52BA55F72b1d2b8F44b3AD";

class KeplerGovernancePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      network: null,
      isLoading: true,
      tokenURI: "",
      proposal: {},
      agree: 0,
      degree: 0,
      result: "",
      blockNumber: 0,
    };
  }

  componentDidMount() {
    this.loadAccountInfo();
    this.setNetworkInfo();
    this.setLimit = setInterval(() => this.setProposal(), 1000);
    this.setBN = setInterval(() => this.setBlockNumber(), 1000);
  }

  loadAccountInfo = async () => {
    const { klaytn } = window;

    if (klaytn) {
      try {
        await klaytn.enable();
        this.setAccountInfo(klaytn);
        this.setProposal(klaytn);
        klaytn.on("accountsChanged", () => {
          this.setAccountInfo(klaytn);
          this.setProposal(klaytn);
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

    await this.setUrl(account);
    this.setState({
      account,
      balance: balance,
    });
  };

  setBlockNumber = async () => {
    const { proposal } = this.state;
    const bn = await caver.klay.getBlockNumber();
    let time =
      parseInt(proposal.blockNumber) + parseInt(proposal.votePeriod) - bn;

    if (time <= 0) time = 0;
    this.setState({
      blockNumber: time,
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

  setUrl = async (account) => {
    const urls = [];
    const tokenNum = await keplerContract.methods
      .tokenOfOwnerByIndex(account, 0)
      .call();

    let tokenIPFS = await keplerContract.methods.tokenURI(tokenNum).call();

    tokenIPFS = ipfs + tokenIPFS.substring(7);

    await fetch(tokenIPFS, {
      headers: {
        "Access-Control-Allow-Origin": "https://nft-kepler-452b.shop/",
        "Access-Control-Allow-Credentials": "true",
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        const url = ipfs + res.image.substring(7);
        urls.push(url);
      });
    this.setState({
      tokenURI: urls[0],
    });
  };

  setProposal = async () => {
    const govContract = new caver.klay.Contract(
      [
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
              internalType: "string",
              name: "note",
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
            {
              internalType: "bool",
              name: "executed",
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
          ],
          name: "forVotes",
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
          name: "againstVotes",
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
              name: "proposalId",
              type: "uint256",
            },
          ],
          name: "result",
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
    const proindex = 7;
    const proposals = await govContract.methods.proposals(proindex).call();
    const agree = await govContract.methods.forVotes(proindex).call();
    const degree = await govContract.methods.againstVotes(proindex).call();
    const result = await govContract.methods.result(proindex).call();
    this.setState({
      proposal: proposals,
      agree: agree,
      degree: degree,
      result: result,
    });
  };

  render() {
    const {
      account,
      balance,
      tokenURI,
      proposal,
      agree,
      degree,
      result,
      isLoading,
      blockNumber,
    } = this.state;
    return (
      <div className="KeplerGovernancePage">
        <Nav address={account} load={isLoading} />
        <Token address={account} balance={balance} tokenURI={tokenURI} />
        <div className="KeplerGovernancePage__main">
          <div className="KeplerGovernancePage__contents">
            <VoteProposal
              proposal={proposal}
              agree={agree}
              degree={degree}
              result={result}
              blockNumber={blockNumber}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default KeplerGovernancePage;
