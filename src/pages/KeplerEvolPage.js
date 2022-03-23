import React, { Component } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import evol from "./evol-log.json";
import Loading from "components/Loading";
import Nav from "components/Nav";
import WalletInfo from "components/WalletInfo";
import TotalEvolTable from "components/TotalEvolTable";
import EvolTable from "components/EvolTable";
import Footer from "components/Footer";

import "./KeplerEvolPage.scss";

// const pinata = "https://gateway.pinata.cloud/ipfs/";
class KeplerEvolPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      network: null,
      data: [],
      isLoading: true,
      // tokenURI: [],
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

  setOwner = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    let account = klaytn.selectedAddress;
    let len = await keplerContract.methods.balanceOf(account).call();
    const promises = [];
    const owners = [];

    for (let id = 0; id < len; id++) {
      const promise = async (index) => {
        let own = await keplerContract.methods
          .tokenOfOwnerByIndex(account, index)
          .call();

        if (evol.includes(parseInt(own))) {
          owners.push(own);
        }
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    owners.sort((a, b) => {
      return a - b;
    });

    this.setState({
      data: this.state.data.concat(owners),
      isLoading: false,
    });
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
    const { account, data, isLoading } = this.state;

    return (
      <div className="KeplerEvolPage">
        <Nav address={account} load={isLoading} />
        <div className="KeplerEvolPage__main">
          <div className="KeplerEvolPage__contents">
            <TotalEvolTable></TotalEvolTable>
            {this.state.isLoading ? (
              <div className="KeplerEvolPage_loading">
                <Loading></Loading>
                <p>내 진화 번호를 불러오는 중입니다...</p>
                <p>* 카이카스 연결이 필요합니다 :)</p>
              </div>
            ) : (
              <EvolTable data={data}></EvolTable>
            )}
          </div>
          {this.state.isLoading || <Footer></Footer>}
        </div>
      </div>
    );
  }
}

export default KeplerEvolPage;
