import React, { Component } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import Loading from "components/Loading";
import Nav from "components/Nav";
import WalletInfo from "components/WalletInfo";
import ProposalsBox from "components/ProposalsBox";
import Token from "components/Token";
import Footer from "components/Footer";

import "./KeplerProposalPage.scss";

class KeplerProposalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      network: null,
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
        this.setOwner(klaytn);
        klaytn.on("accountsChanged", () => {
          this.setAccountInfo(klaytn);
          this.setOwner(klaytn);
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
    const { account, balance, network } = this.state;
    return (
      <div className="KeplerProposalPage">
        <Nav network={network} />
        <div className="KeplerProposalPage__main">
          <WalletInfo address={account} balance={balance} />
          <div className="KeplerProposalPage__contents">
            <ProposalsBox />
            <Token />
          </div>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}

export default KeplerProposalPage;
