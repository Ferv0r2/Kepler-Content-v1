import React from "react";

import "./WalletInfo.scss";

const WalletInfo = ({ address, balance }) => {
  return (
    <div className="WalletInfo">
      <h2 className="WalletInfo__title">Wallet Information</h2>
      <div className="WalletInfo__infoBox">
        <div className="WalletInfo__info">
          <span className="WalletInfo__label">Wallet Address</span>
          {address || "Login with Kaikas :)"}
        </div>
        <div className="WalletInfo__info">
          <span className="WalletInfo__label">Balance</span>
          <span className="WalletInfo__balance">{balance}</span>
          <span className="WalletInfo__unit">KLAY</span>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
