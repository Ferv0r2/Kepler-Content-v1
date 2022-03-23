import React, { useState } from "react";
import caver from "../klaytn/caver";

import "./VoteProposal.scss";

// const b = caver.klay.getBlockNumber();
const VoteProposal = ({ proposal, agree, degree, result, blockNumber }) => {
  let stats = "";
  if (result == 0) {
    stats = "투표중";
  } else if (result == 1) {
    stats = "취소";
  } else if (result == 2) {
    stats = "동률";
  } else if (result == 3) {
    stats = "지향";
  } else {
    stats = "지양";
  }
  return (
    <div className="VoteProposal">
      <div className="VoteProposal__title">
        <div className="voteTitle">Proposal - #0</div>
        <div className="voteStatus">
          <div className="voteAgree">{agree}</div>
          <div className="voteDegree">{degree}</div>
        </div>
      </div>
      <div className="VoteProposal__infoBox">
        <div className="VoteProposal__info">
          <div className="VoteProposal__status">
            <div>
              <label>시작 블록 넘버</label>
              <p>{proposal.blockNumber}</p>
            </div>
            <div>
              <label>남은 블록 넘버</label>
              <p>{blockNumber}</p>
            </div>
            <div>
              <label>현재 제안 상태</label>
              <p>{stats}</p>
            </div>
          </div>
        </div>
        아래 제안에 따라 찬성 혹은 반대 투표를 진행할 수 있습니다.
      </div>
      <div className="VoteProposal__contents">
        <form>
          <div className="mb-3">
            <label htmlFor="gove-title" className="form-label">
              제목
            </label>
            <p>{proposal.title}</p>
          </div>
          <div className="mb-3">
            <label htmlFor="gove-contents" className="form-label">
              내용
            </label>
            {/* <p>{proposal.content}</p> */}
            <p>
              이번 안건은 오픈씨 진출에 대한 내용입니다.<br></br>
              <br></br> 이유<br></br>
              1. 현재 클럽스 내 거래량이 적습니다.<br></br> 2. Activity 확인이
              가능해집니다.<br></br> 3. 클레이 코인 사용이 가능해집니다.
              <br></br> 4. 아이템 컬렉션의 총 발행량 확인 및 전송이 가능해지며
              판매와 구입이 편리해집니다.<br></br> 5. 거래소 추가 상장으로써
              신규 유입의 진입장벽이 낮춰집니다.<br></br>
              <br></br> 오해<br></br> 1. 오픈씨 진출을 통해 클럽스를 떠나는 것이
              아니라 오픈씨와 병행하는 것입니다. <br></br>2. 추후에 오픈될
              믹스풀에 대해 다양한 방식으로 참여 할 것이며 믹스풀은 클럽스에
              있어야만 받는 것이 아니라 거버넌스 통과 후 소각 시키는 양에 따라
              분배 받는 것입니다.
              <br></br>3. DSC LABEL과 관계는 좋으며, 오픈씨 진출은 파트너십
              관계에 영향을 미치지 않습니다. <br></br>
              <br></br>정보<br></br> 1. 오픈씨 진출은 마이그레이션으로
              진행됩니다. <br></br>2. 마이그레이션 시, 기존 클럽스 누적 거래량은
              사라집니다.
              <br></br> 3. 투표에 참가해주신 분들께 랜덤하게 보상을 지급합니다.
              <br></br>4. 투표율이 총 발행량 10% 미만인 경우, 해당 안건은
              취소됩니다.
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="gove-summary" className="form-label">
              요약
            </label>
            <p>{proposal.summary}</p>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              제안자
            </label>
            <p>{proposal.proposer}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoteProposal;
