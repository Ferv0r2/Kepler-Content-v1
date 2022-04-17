import React, { Component } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
// import fetch from "node-fetch";

import evol from "./evol-log.json";
import mix from "./mix.json";
import Loading from "components/Loading";
import Layout from "../components/Layout";
import Nav from "components/Nav";
import TotalEvolTable from "components/TotalEvolTable";
import EvolTable from "components/EvolTable";

import "./KeplerEvolPage.scss";

const ipfs = "https://ipfs.infura.io/ipfs/";
class KeplerEvolPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: 0,
      network: null,
      data: [],
      mixOwn: [],
      mix: [],
      isLoading: true,
      tokenURI: [],
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

  setURI = async (array) => {
    const promises = [];
    const urls = [];

    const len = array.length;
    for (let id = 0; id < len; id++) {
      const promise = async (index) => {
        const res = await fetch(array[index]);
        let posts = await res.json();
        posts = ipfs + posts.image.substring(7);
        console.log(posts);

        urls.push(posts);
      };
      promises.push(promise(id));
    }
    await Promise.all(promises);

    return urls;
  };

  setOwner = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    let account = klaytn.selectedAddress;
    let len = await keplerContract.methods.balanceOf(account).call();

    const promises = [];
    const owners = [];
    const mix_total = [];
    const mix_owners = [];
    // const tokenLinks = [];

    for (let id = 0; id < len; id++) {
      const promise = async (index) => {
        let own = await keplerContract.methods
          .tokenOfOwnerByIndex(account, index)
          .call();

        if (evol["token"].includes(parseInt(own))) {
          // let url = await keplerContract.methods.tokenURI(index).call();
          // url = ipfs + url.substring(7);
          owners.push(own);
        }

        if (mix["mix"].includes(parseInt(own))) {
          // let url = await keplerContract.methods.tokenURI(index).call();
          // url = ipfs + url.substring(7);
          mix_total.push(own);

          if (evol["token"].includes(parseInt(own))) {
            mix_owners.push(own);
          }
        }

        if (mix["hmix"].includes(parseInt(own))) {
          // let url = await keplerContract.methods.tokenURI(index).call();
          // url = ipfs + url.substring(7);
          mix_total.push(own);

          if (evol["token"].includes(parseInt(own))) {
            mix_owners.push(own);
          }
        }
      };

      promises.push(promise(id));
    }
    await Promise.all(promises);

    // const tokenURIs = await this.setURI(tokenLinks);

    owners.sort((a, b) => {
      return a - b;
    });

    this.setState({
      data: this.state.data.concat(owners),
      mixOwn: this.state.data.concat(mix_total),
      mix: this.state.data.concat(mix_owners),
      // tokenURI: this.state.tokenURI.concat(tokenURIs),
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
    const { account, data, mixOwn, mix, isLoading } = this.state;

    return (
      <Layout>
        <div className="KeplerEvolPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerEvolPage__main">
            <div className="KeplerEvolPage__contents">
              <TotalEvolTable />
              {this.state.isLoading ? (
                <div className="KeplerEvolPage_loading">
                  <Loading />
                  <p>내 진화 번호를 불러오는 중입니다...</p>
                </div>
              ) : (
                <div>
                  <EvolTable name={"내 진화 번호"} data={data}></EvolTable>
                  <EvolTable name={"내 믹스 번호"} data={mixOwn}></EvolTable>
                  <EvolTable name={"내 믹스 진화 번호"} data={mix}></EvolTable>
                </div>
                // <EvolTable data={data} tokenURI={tokenURI}></EvolTable>
              )}
            </div>
            {/* {this.state.isLoading || } */}
          </div>
        </div>
      </Layout>
    );
  }
}

export default KeplerEvolPage;
