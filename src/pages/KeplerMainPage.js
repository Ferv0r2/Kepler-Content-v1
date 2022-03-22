import React, { Component } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import evol from "./evol-log.json";
import Nav from "components/Nav";
import ContentTable from "components/ContentTable";
import Footer from "components/Footer";

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
      <div className="KeplerEvolPage">
        <Nav address={account} load={isLoading} />
        <div className="KeplerEvolPage__main">
          <div className="KeplerEvolPage__contents">
            <ContentTable></ContentTable>
          </div>
        </div>
      </div>
    );
  }
}

export default KeplerMainPage;
