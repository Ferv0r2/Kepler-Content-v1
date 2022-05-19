import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Nav from "components/Nav";

// import keplerContract from "klaytn/KeplerContract";

import "./Proposal.scss";

const nftCA = "0x1C7FeD12d753D8a14aAfD223E87905B1Fe31B2Af";
const govCA = "0x8ee0Be3319D99E15EB7Ec69DF68b010948bb17B4";
const Proposal = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [network, setNetwork] = useState(null);
  const [status, setStatus] = useState(0);
  const [proposal, setProposal] = useState({});
  const params = useParams();
  const proposal_id = parseInt(params.id) - 1;
  // const location = useLocation();
  // const navi = useNavigate();

  useEffect(() => {
    loadAccountInfo();
    setNetworkInfo();
    setProposalInfo();
  });

  const loadAccountInfo = async () => {
    const { klaytn } = window;

    if (klaytn) {
      try {
        await klaytn.enable();
        setAccountInfo(klaytn);
        klaytn.on("accountsChanged", () => {
          setAccountInfo(klaytn);
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

  const setAccountInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    const keplerContract = new caver.klay.Contract(
      [
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "owner",
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
      nftCA
    );

    const accounts = klaytn.selectedAddress;
    const balances = keplerContract.methods.balanceOf(account).call();
    setAccount(accounts);
    setBalance(balances);
    setLoading(false);
  };

  const setNetworkInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    setNetwork(klaytn.networkVersion);
    klaytn.on("networkChanged", () => setNetwork(klaytn.networkVersion));
  };

  const setProposalInfo = async () => {
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
    console.log(params);
    console.log(proposal_id);
    console.log(typeof proposal_id);

    const stat = await govContract.methods.status(proposal_id).call();
    const propose = await govContract.methods.proposals(proposal_id).call();
    setStatus(stat);
    setProposal(propose);
  };

  // const setBlockNumber = async () => {
  //   const { proposal } = this.state;
  //   const bn = await caver.klay.getBlockNumber();
  //   let time =
  //     parseInt(proposal.blockNumber) + parseInt(proposal.votePeriod) - bn;

  //   if (time <= 0) time = 0;
  //   this.setState({
  //     blockNumber: time,
  //   });
  // };

  // const signTransaction = async () => {
  //   const { title, content, summary } = this.state;
  //   const { address } = this.props;

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

  return (
    <Layout>
      <div className="Proposal">
        <Nav address={account} load={isLoading} />
        <div className="container">
          <div className="Proposal__before">
            <Link to="/governance">
              <div className="prev">
                <img src="images/governance/goback.png" />
                <p>목록으로 돌아가기</p>
              </div>
            </Link>
          </div>
          <div className="Proposal__contents">
            <div className="Proposal__title">{proposal.title}</div>
            <div className="Proposal__status">
              <div className="Proposal__period">
                <p>투표 기간</p>
                <p>22.03.07 ~ 22.05.09</p>
              </div>
              <div className="Proposal__vote">
                <div className="vote__type">
                  <ul>
                    <li>찬성</li>
                    <li>반대</li>
                  </ul>
                </div>
                <div className="vote__count">
                  <ul>
                    <li>50</li>
                    <li>3000</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="Proposal__proposer">
              <h2 className="sub_title">작성자</h2>
              <p>{account}</p>
            </div>
            <div className="Proposal__detail">
              <h2 className="sub_title">세부 내용</h2>
              <p>
                많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다. 많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.
              </p>
            </div>
            <div className="Proposal__detail">
              <h2 className="sub_title">요약</h2>
              <p>
                많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다. 많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.많은 내용이 들어있다.많은 내용이
                들어있다.많은 내용이 들어있다.
              </p>
            </div>
            <div className="Proposal__btn">
              <div
                type="submit"
                className="btn-suggest"
                // onClick={signTransaction}
              >
                찬성하기
              </div>
              <div
                type="submit"
                className="btn-suggest"
                // onClick={signTransaction}
              >
                반대하기
              </div>
            </div>
            <div className="Vote__nft">
              <h2 className="sub_title">MY NFT</h2>
              <div className="nft__count">
                <p>수량: {balance}개</p>
              </div>
              <div className="nft">
                <div>
                  <img src="images/logo.png" />
                </div>
                <div>
                  <img src="images/logo.png" />
                </div>
                <div>
                  <img src="images/logo.png" />
                </div>
                <div>
                  <img src="images/logo.png" />
                </div>
                <div>
                  <img src="images/logo.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proposal;
