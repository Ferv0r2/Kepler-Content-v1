import React from "react";

import Proposal from "./Proposal";

import "./ProposalsBox.scss";

const ProposalsBox = () => {
  return (
    <div className="ProposalBox">
      <div className="ProposalBox__contents">
        <Proposal />
        <Proposal />
        <Proposal />
        <Proposal />
        <Proposal />
        <Proposal />
      </div>
    </div>
  );
};

export default ProposalsBox;
