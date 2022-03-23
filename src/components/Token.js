import React, { Component } from "react";
import caver from "../klaytn/caver";
import keplerContract from "../klaytn/KeplerContract";

import "./Token.scss";

const govCA = "0xC423E1f75C3676AE3b52BA55F72b1d2b8F44b3AD";
const nftCA = "0xf1919F40af70394762bed30E98d95DdFbac79080";

const proindex = 7;

class Token extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadAccountInfo();
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

  setNetworkInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    this.setState({ network: klaytn.networkVersion });
    klaytn.on("networkChanged", () =>
      this.setNetworkInfo(klaytn.networkVersion)
    );
  };

  voteAgree = async () => {
    const { address } = this.props;
    const govContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "nft",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "keplerIds",
              type: "uint256[]",
            },
          ],
          name: "voteFor",
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
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "keplerVoted",
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
      ],
      govCA
    );

    const myNFT = await keplerContract.methods.balanceOf(address).call();

    let len = 0;
    if (myNFT > 50) {
      len = 50;
    } else {
      len = myNFT;
    }

    const promises = [];
    let voteAgrees = [];

    for (let id = 0; id < len; id++) {
      const promise = async (i) => {
        let own = await keplerContract.methods
          .tokenOfOwnerByIndex(address, i)
          .call();
        voteAgrees.push(own);
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    const gasFee = 3000000 * voteAgrees.length;
    await govContract.methods.voteFor(proindex, nftCA, voteAgrees).send({
      from: address,
      gas: gasFee,
    });
    alert("찬성 투표 완료!");
  };

  voteDegree = async () => {
    const { address } = this.props;
    const govContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              internalType: "uint256",
              name: "proposalId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "nft",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "keplerIds",
              type: "uint256[]",
            },
          ],
          name: "voteAgainst",
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
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "keplerVoted",
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
      ],
      govCA
    );

    const myNFT = await keplerContract.methods.balanceOf(address).call();

    let len = 0;
    if (myNFT > 50) {
      len = 50;
    } else {
      len = myNFT;
    }

    const promises = [];
    let voteDegrees = [];

    for (let id = 0; id < len; id++) {
      const promise = async (i) => {
        let own = await keplerContract.methods
          .tokenOfOwnerByIndex(address, i)
          .call();

        voteDegrees.push(own);
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    const gasFee = 3000000 * voteDegrees.length;
    await govContract.methods.voteAgainst(proindex, nftCA, voteDegrees).send({
      from: address,
      gas: gasFee,
    });
    alert("반대 투표 완료!");
  };

  render() {
    const { balance, tokenURI } = this.props;
    return (
      <div className="Token" id="card">
        <div className="Token__box">
          <div className="Token__balance">
            <label>나의 NFT 갯수 : {balance}</label>
          </div>
          <div className="Token__info">
            <div className="Token__id"></div>
            <div className="Token__img">
              <img src={tokenURI} />
            </div>
          </div>
          <div className="Token__vote">
            <p>* 버튼 당, 50개씩 투표 가능합니다.</p>
            <p>* 50개 보다 적을 시, 보유량 만큼 투표됩니다.</p>
          </div>
          <div className="Token__agree" onClick={this.voteAgree}>
            찬성
          </div>
          <div className="Token__degree" onClick={this.voteDegree}>
            반대
          </div>
        </div>
      </div>
    );
  }
}

export default Token;
