import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Nav from "components/Nav";

import "./Proposal.scss";

const Proposal = ({ account }) => {
  const params = useParams();
  const location = useLocation();
  const navi = useNavigate();

  console.log(params);
  console.log(location);
  console.log(navi);

  // componentDidMount() {
  //   loadAccountInfo();
  //   setNetworkInfo();
  // }

  const loadAccountInfo = async () => {
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

  const setAccountInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    const account = klaytn.selectedAddress;
    this.setState({
      account,
      isLoading: false,
    });
  };

  const setNetworkInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    this.setState({ network: klaytn.networkVersion });
    klaytn.on("networkChanged", () =>
      this.setNetworkInfo(klaytn.networkVersion)
    );
  };

  const onEventTitleChange = async (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  const onEventContentChange = async (e) => {
    this.setState({
      content: e.target.value,
    });
  };

  const onEventSummaryChange = async (e) => {
    this.setState({
      summary: e.target.value,
    });
  };

  const signTransaction = async () => {
    const { title, content, summary } = this.state;
    const { address } = this.props;

    const govContract = new caver.klay.Contract(
      [
        {
          constant: false,
          inputs: [
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
              name: "votePeriod",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "_nft",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "keplerIds",
              type: "uint256[]",
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
      ],
      govCA
    );

    const suggestArray = [];

    // for문으로 여러개 O
    const suggestToken = await nftContract.methods
      .tokenOfOwnerByIndex(address, 0)
      .call();

    suggestArray.push(suggestToken);

    console.log(title);
    console.log(content);
    console.log(summary);
    console.log(suggestArray);

    const sendTx = await govContract.methods
      .propose(title, summary, content, "", 86400, nftCA, suggestArray)
      .send({
        from: address,
        gas: 7500000,
      })
      .on("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
        this.setState({ txHash: transactionHash });
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
        alert("신청이 정상적으로 완료되었습니다.");
        this.setState({ receipt: JSON.stringify(receipt) });
      })
      .on("error", (error) => {
        console.log("error", error);
        alert("신청 에러.");
        this.setState({ error: error.message });
      });
  };

  return (
    <Layout>
      <div className="Proposal">
        <Nav address={account} />
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
            <div className="Proposal__title">
              제 친구가 칼에 찔렸지만 가해자가 촉법소년 이라는 이유로 제대로된
              처벌을 받지 않을 것 같습니다
            </div>
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
                onClick={signTransaction}>
                찬성하기
              </div>
              <div
                type="submit"
                className="btn-suggest"
                onClick={signTransaction}>
                반대하기
              </div>
            </div>
            <div className="Vote__nft">
              <h2 className="sub_title">MY NFT</h2>
              <div className="nft__count">
                <p>수량: 6개</p>
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
