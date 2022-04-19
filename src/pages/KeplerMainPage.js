import React, { Component } from "react";
import { Link } from "react-router-dom";
import caver from "klaytn/caver";
import keplerContract from "klaytn/KeplerContract";

import Nav from "components/Nav";
import Layout from "../components/Layout";

import "./KeplerMainPage.scss";

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
            <div className="KeplerMainPage__contents">
              <div className="KeplerMainPage__infoBox">
                {/* <div className="v-line" /> */}
                <img src="images/main_icon.png" />
                <div className="KeplerMainPage__link">
                  <div>
                    <li>
                      <Link to="/evol">Today's Evolution</Link>
                    </li>
                    <li>
                      <Link to="/box">Random Box</Link>
                    </li>
                  </div>
                  <div>
                    <li>
                      <Link to="/mining">Kepler Mining</Link>
                    </li>
                    <li>
                      <Link to="/shop">Goldot Shop</Link>
                    </li>
                  </div>
                  <div>
                    <li>
                      <Link to="/governance">Governanace</Link>
                    </li>
                  </div>
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
