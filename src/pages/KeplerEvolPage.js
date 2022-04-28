import React, { Component } from "react";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";
import fetch from "node-fetch";

// import evol from "./evol-log.json";
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
      network: null,
      data: [],
      mixOwn: [],
      mix: [],
      spawning: [],
      totalLoading: true,
      isLoading: true,
      tokenURI: [],
      evol: [],
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

  setTotal = async () => {
    const baseURI = "https://api.kepler-452b.net/evol/";

    // GET DAILY EVOL
    const date = new Date();

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const z_day = ("0" + (date.getDate() - 1)).slice(-2);

    const today = `${year}-${month}-${day}`;
    const yesterday = `${year}-${month}-${z_day}`;

    let evol;
    try {
      const evolURI = baseURI + `${today}-daily`;
      const res = await fetch(evolURI);
      evol = await res.json();
      evol = JSON.parse(evol);
    } catch {
      const evolURI = baseURI + `${yesterday}-daily`;
      const res = await fetch(evolURI);
      evol = await res.json();
    }

    this.setState({
      evol,
      totalLoading: false,
    });
  };

  setOwner = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    const { totalLoading } = this.state;
    if (totalLoading == true) await this.setTotal();

    const { evol } = this.state;

    let account = klaytn.selectedAddress;
    const len = await keplerContract.methods.balanceOf(account).call();

    const promises = [];
    const owners = [];
    const spawning_owners = [];
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

        if (evol["spawning"].includes(parseInt(own))) {
          // let url = await keplerContract.methods.tokenURI(index).call();
          // url = ipfs + url.substring(7);
          spawning_owners.push(own);
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
    spawning_owners.sort((a, b) => {
      return a - b;
    });
    mix_total.sort((a, b) => {
      return a - b;
    });
    mix_owners.sort((a, b) => {
      return a - b;
    });

    this.setState({
      data: [...owners],
      spawning: [...spawning_owners],
      mixOwn: [...mix_total],
      mix: [...mix_owners],
      // tokenURI: this.state.tokenURI.concat(tokenURIs),
      isLoading: false,
    });
  };

  setAccountInfo = async () => {
    const { klaytn } = window;
    if (klaytn === undefined) return;

    const account = klaytn.selectedAddress;
    this.setState({
      account,
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
    const {
      account,
      data,
      spawning,
      mixOwn,
      mix,
      evol,
      totalLoading,
      isLoading,
    } = this.state;

    return (
      <Layout>
        <div className="KeplerEvolPage">
          <Nav address={account} load={isLoading} />
          <div className="KeplerEvolPage__main">
            <div className="KeplerEvolPage__contents">
              <TotalEvolTable evol={evol} load={totalLoading} />
              {isLoading ? (
                <div className="KeplerEvolPage_loading">
                  <Loading />
                  <p>내 진화 번호를 불러오는 중입니다...</p>
                </div>
              ) : (
                <div>
                  <EvolTable
                    name={"내 진화 번호"}
                    data={data}
                    info={"금일 진화한 NFT가 없습니다..."}
                  />
                  <EvolTable
                    name={"내 산란된 번호"}
                    data={spawning}
                    info={"금일 산란된 NFT가 없습니다..."}
                  />
                  <EvolTable
                    name={"내 믹스 번호"}
                    data={mixOwn}
                    info={"믹스종 NFT가 없습니다..."}
                  />
                  <EvolTable
                    name={"내 믹스 진화 번호"}
                    data={mix}
                    info={"금일 진화한 NFT가 없습니다..."}
                  />
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
