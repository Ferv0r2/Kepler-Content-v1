import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "components/Layout";
import Nav from "components/Nav";
import NFTBox from "components/NFTBox";

import keplerContract from "klaytn/KeplerContract";

import "./Proposal.scss";

// const baseUri = "http://localhost:4000/governance/";
const baseUri = "https://governance.api.kepler-452b.net/governance/";
const nftCA = "0x1C7FeD12d753D8a14aAfD223E87905B1Fe31B2Af";
const govCA = "0x8ee0Be3319D99E15EB7Ec69DF68b010948bb17B4";

const Proposal = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [network, setNetwork] = useState(null);
  const [status, setStatus] = useState(0);
  const [proposal, setProposal] = useState({});
  const [vote, setVote] = useState("0");
  const [blockNum, setBlockNumber] = useState(0);
  const [times, setTimer] = useState("");
  const [tkURI, setTokenURIs] = useState([]);
  const params = useParams();
  const proposal_id = parseInt(params.id) - 1;
  // const location = useLocation();
  // const navi = useNavigate();

  useEffect(() => {
    loadAccountInfo();
    setNetworkInfo();
    setProposalInfo();
    setAPI();
  }, []);

  useEffect(() => {
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
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "tokenOfOwnerByIndex",
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
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
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
    const balances = await keplerContract.methods.balanceOf(accounts).call();

    const tokenURIs = [];

    const promises = [];
    for (let id = 0; id < balances; id++) {
      if (id > 4) {
        break;
      }
      const promise = async (index) => {
        const tokenId = await keplerContract.methods
          .tokenOfOwnerByIndex(accounts, index)
          .call();

        const url = await keplerContract.methods.tokenURI(tokenId).call();
        const res = await fetch(url);
        const post = await res.json();
        tokenURIs.push(post.image);
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    setAccount(accounts);
    setBalance(balances);
    setTokenURIs(tokenURIs);
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

    const stat = await govContract.methods.status(proposal_id).call();
    const propose = await govContract.methods.proposals(proposal_id).call();

    const bn = await caver.klay.getBlockNumber();
    let time =
      parseInt(propose.blockNumber) + parseInt(propose.votePeriod) - bn;
    if (time <= 0) time = 0;

    let hour =
      parseInt(time / 3600) < 10
        ? "0" + parseInt(time / 3600)
        : parseInt(time / 3600);
    let min =
      parseInt((time % 3600) / 60) < 10
        ? "0" + parseInt((time % 3600) / 60)
        : parseInt((time % 3600) / 60);
    let sec = time % 60 < 10 ? "0" + (time % 60) : time % 60;

    const result = hour + ":" + min + ":" + sec;

    setStatus(stat);
    setProposal(propose);
    setBlockNumber(time);
    setTimer(result);
  };

  const setAPI = async () => {
    const url = baseUri + `${proposal_id}`;
    const response = await fetch(url).then((res) => res.json());
    console.log(response);
    setVote(response);
  };

  const getTokenIds = async () => {
    const voted = vote.totalTokenIds;
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
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "tokenOfOwnerByIndex",
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
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ],
      nftCA
    );

    const tokenIds = [];
    const expect = [];

    if (balance < 150) {
      const promises = [];
      for (let id = 0; id < balance; id++) {
        const promise = async (index) => {
          const tokenId = await keplerContract.methods
            .tokenOfOwnerByIndex(account, index)
            .call();

          if (voted.includes(tokenId)) {
            expect.push(tokenId);
          } else {
            tokenIds.push(tokenId);
          }
        };

        promises.push(promise(id));
      }
      await Promise.all(promises);
    } else {
      for (let i = 0; i < balance; i++) {
        const tokenId = await keplerContract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();

        if (voted.includes(tokenId)) {
          expect.push(tokenId);
        } else {
          tokenIds.push(tokenId);
        }
      }
    }

    if (tokenIds.length == 0) {
      return false;
    }

    return [tokenIds, expect];
  };

  const postAPI = async (uri) => {
    try {
      const response = await fetch(uri, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "X-PINGOTHER, Content-Type",
        "Access-Control-Max-Age": 86400,
      }).then((res) => res.json());
      return response;
    } catch {
      return false;
    }
  };

  const signTransaction = async (voteType, e) => {
    if (status != 0) {
      alert("해당 제안의 투표는 종료되었습니다.");
      return;
    }
    const message = `투표에 참여해주셔서 감사합니다.

    ${proposal_id + 1}번 제안
    ${proposal.title}에 대한 투표입니다.

    보유 수량만큼 투표됩니다. 한 번 투표하면 재투표가 불가합니다.
    
    본 메세지는 블록체인 거래를 발생시키거나 트랜잭션 비용(수수료)이 발생하지 않습니다.

    해당 서명이 공식 홈페이지 URI가 맞는지 여러 번 확인해주세요 :)
    
    Wallet address:
    ${account}
    
    Official Contents WebSite:
    https://nft-kepler-452b.shop
    `;
    try {
      await caver.klay.sign(message, account);
    } catch {
      alert("투표가 취소되었습니다.");
      return;
    }
    const getData = await getTokenIds();

    if (!getData) {
      alert("투표를 이미 하셨거나 투표할 수 있는 NFT가 없습니다.");
      return;
    }
    const postURI =
      baseUri + `${proposal_id}/${account}/${voteType}/` + String(getData[0]);
    const postData = await postAPI(postURI);

    if (postData) {
      if (getData[1].length != 0) {
        alert(
          `${getData[1]}\n 위 NFT는 이미 투표된 상태입니다. 제외된 상태로 투표가 진행됩니다.`
        );
      }

      if (voteType == 1) {
        alert(`${getData[0].length}개 만큼 찬성 투표가 완료되었습니다.`);
      } else if (voteType == 1) {
        alert(`${getData[0].length}개 만큼 반대 투표가 완료되었습니다.`);
      }
      setVote(postData);
    } else {
      alert("투표중 에러가 발생하였습니다. 다시 시도해주세요.");
    }
  };

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
                <div className="blockNumber_label">
                  <p>시작 블록넘버</p>
                  <p>남은 블록넘버</p>
                </div>
                <div className="blockNumber">
                  <p>{proposal.blockNumber}</p>
                  <p>{blockNum}</p>
                </div>
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
                    <li>{vote.voteAgree}</li>
                    <li>{vote.voteDegree}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="Proposal__info">
              블록이 밀리지 않았다는 가정 하에 {times} 만큼 남았습니다.
            </div>
            <div className="Proposal__proposer">
              <h2 className="sub_title">작성자</h2>
              <p>{account}</p>
            </div>
            <div className="Proposal__detail">
              <h2 className="sub_title">세부 내용</h2>
              <p>{proposal.content}</p>
            </div>
            <div className="Proposal__detail">
              <h2 className="sub_title">요약</h2>
              <p>{proposal.summary}</p>
            </div>
            <div className="Proposal__btn">
              <div
                type="submit"
                className="btn-suggest"
                onClick={(e) => signTransaction(1, e)}
              >
                찬성하기
              </div>
              <div
                type="submit"
                className="btn-suggest"
                onClick={(e) => signTransaction(0, e)}
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
                {tkURI.length != 0 ? (
                  tkURI.map((k, i) => {
                    return (
                      <>
                        <NFTBox key={k} tokenURI={tkURI[i]}></NFTBox>
                      </>
                    );
                  })
                ) : (
                  <h2>NFT가 없습니다. 투표할 수 없습니다.</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proposal;
