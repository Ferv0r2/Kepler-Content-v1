import React from "react";
import "./CreateProposal.scss";

const CreateProposal = () => {
  return (
    <div className="CreateProposal">
      <div className="CreateProposal__title">CreateProposal</div>
      <div className="CreateProposal__infoBox">
        <div className="CreateProposal__info">
          아래 제안에 따라 찬성 혹은 반대 투표를 진행할 수 있습니다.
        </div>
      </div>
      <div className="CreateProposal__contents">
        <form>
          <div className="mb-3">
            <label htmlFor="gove-title" className="form-label">
              제목
            </label>
            <input
              type="text"
              className="form-control"
              id="gove-title"
              aria-describedby="goveHelp"
            />
            <div id="goveHelp" className="form-text">
              [ Discord - K4-Suggestion ] 에서 먼저 문의해주시기 바랍니다 :)
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="gove-contents" className="form-label">
              내용
            </label>
            <input type="text" className="form-control" id="gove-contents" />
          </div>
          <div className="mb-3">
            <label htmlFor="gove-summary" className="form-label">
              요약
            </label>
            <input type="text" className="form-control" id="gove-summary" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              제안자
            </label>
            <label id="account">0x00..</label>
          </div>

          <button type="submit" className="btn btn-primary">
            제안 생성
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
