import React, { Component } from "react";
import { Link } from "react-router-dom";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import Nav from "components/Nav";
import Layout from "../components/Layout";

import "./KeplerMainPage.scss";

// const pinata = "https://gateway.pinata.cloud/ipfs/";
class KeplerMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      isLoading: true,
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
    const balance = await caver.klay.getBalance(account);
    this.setState({
      account,
      isLoading: false,
      balance: caver.utils.fromPeb(balance, "KLAY"),
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
    const { account, balance, isLoading } = this.state;

    // if (this.state.isLoading) return <Loading />;

    return (
      <Layout>
        <div className="KeplerMainPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerMainPage__main">
            <h2 className="KeplerMainPage__title">Kepler Contents</h2>
            <div className="KeplerMainPage__contents">
              <div className="KeplerMainPage__infoBox">
                <img src="images/main_icon.png" />
                <div className="KeplerMainPage__link">
                  <li>
                    <Link to="/evol">일일 진화 보러가기</Link>
                  </li>
                  {/* <li>
                    <Link to="/box">랜덤 박스 보러가기</Link>
                  </li> */}
                  <li>
                    <Link to="/governance">거버넌스 의제 보러가기</Link>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerMainPage;
