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

  // getUrl = async (address) => {
  //   const promises = [];
  //   const urls = [];

  //   const len = address.length;
  //   for (let id = 0; id < len; id++) {
  //     const promise = async (index) => {
  //       await fetch(address[index]),
  //         {
  //           headers: {
  //             "Access-Control-Allow-Origin": "http://localhost:8888/",
  //             "Access-Control-Allow-Credentials": "true",
  //           },
  //         }
  //           .then((res) => {
  //             return res.json();
  //           })
  //           .then((res) => {
  //             const url = pinata + res.image.substring(7);
  //             urls.push(url);
  //           });
  //     };
  //     promises.push(promise(id));
  //   }
  //   await Promise.all(promises);

  //   return urls;
  // };

  setOwner = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    let account = klaytn.selectedAddress;

    const promises = [];
    const len = evol.length;

    const owners = [];
    for (let id = 0; id < len; id++) {
      const promise = async (index) => {
        let own = await keplerContract.methods
          .ownerOf(evol[index].value)
          .call();

        own = own.toUpperCase();
        account = account.toUpperCase();

        if (own === account) {
          owners.push(evol[index].value);
        }
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    // const urls = [];
    // const ownlen = owners.length;
    // for (let id = 0; id < ownlen; id++) {
    //   const promise = async (index) => {
    //     let url = await keplerContract.methods.tokenURI(owners[index]).call();

    //     url = pinata + url.substring(7);
    //     // url = await this.getUrl(url);
    //     urls.push(url);
    //   };
    //   promises.push(promise(id));
    // }
    // await Promise.all(promises);

    // const tokenURIs = await this.getUrl(urls);
    this.setState({
      data: this.state.data.concat(owners.sort()),
      isLoading: false,
      // tokenURI: this.state.tokenURI.concat(tokenURIs),
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
    const { account, balance, network, data } = this.state;

    // if (this.state.isLoading) return <Loading />;

    return (
      <div className="KeplerEvolPage">
        <Nav network={network} />
        <div className="KeplerEvolPage__main">
          <WalletInfo address={account} balance={balance} />
          <div className="KeplerEvolPage__contents">
            {/* <EvolTable data={data} tokenURI={tokenURI}></EvolTable> */}
            <TotalEvolTable></TotalEvolTable>
            {this.state.isLoading ? (
              <Loading></Loading>
            ) : (
              <EvolTable data={data}></EvolTable>
            )}
          </div>
          {this.state.isLoading ? <div></div> : <Footer></Footer>}
        </div>
      </div>
    );
  }
}

export default KeplerEvolPage;
