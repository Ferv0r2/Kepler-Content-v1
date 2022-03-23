import React from "react";

import VoteProposal from "./VoteProposal";

import "./ProposalsBox.scss";

const ProposalsBox = () => {
  return (
    <div className="ProposalBox">
      <div className="ProposalBox__contents">
        <VoteProposal />
      </div>
    </div>
  );
};

export default ProposalsBox;
