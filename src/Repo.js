import React from "react";
import FontAwesome from "react-fontawesome";

import "./Repo.css";
import Button from "./Button";

const Culprits = props => {
  return (
    <div className="Repo-culprits">
      {props.committers.reduce((agg, committer, index) => {
        return `${agg} ${committer}`;
      }, "Potential culprits: ")}
    </div>
  );
};

export default ({
  name,
  branch,
  status,
  buildUrl,
  committers,
  lifecycle,
  onRemoveClick
}) => (
  <div
    className={`Repo is-status-${status} ${
      lifecycle === "running" ? "is-lifecycle-running" : ""
    }`}
  >
    <div className="Repo-body">
      <a target="blank" className="Repo-name" href={buildUrl}>
        {name}
      </a>
      {status === "failed" && committers ? <Culprits committers={committers} /> : null}
    </div>
    <div className="Repo-footer">
      <div className="Repo-footerLeft">{branch}</div>
      <div className="Repo-footerRight">
        <span className="Repo-delete">
          <Button
            onClick={() => onRemoveClick(name, branch)}
            title="Remove project from list"
            className="Repo-delete"
            type="warning"
          >
            <FontAwesome name="trash" />
          </Button>
        </span>
      </div>
    </div>
  </div>
);
