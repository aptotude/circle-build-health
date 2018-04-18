import React, { Component, Fragment } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Button from "./Button";

import "./Modal.css";

const GET_PROJECTS = gql`
  query {
    projects {
      name
    }
  }
`;

const ModalSkeleton = () => (
  <Fragment>
    <div className="Modal-loadingIndicator Modal-titleLoadingIndicator" />
    <div className="Modal-formControl">
      <div className="Modal-loadingIndicator Modal-labelLoadingIndicator" />

      <div className="Modal-loadingIndicator Modal-inputLoadingIndicator" />
    </div>
    <div className="Modal-formControl">
      <div className="Modal-loadingIndicator Modal-labelLoadingIndicator" />

      <div className="Modal-loadingIndicator Modal-inputLoadingIndicator" />
    </div>
  </Fragment>
);

class ModalWithQuery extends Component {
  constructor(props) {
    super(props);
    this.repoRef = React.createRef();
  }

  state = {
      branchValue: 'master'
  };

  onAddClick = () => {
      const repoName = this.repoRef.current.value;
      const branchName = this.state.branchValue;

      this.props.onAdd(repoName, branchName);
      this.props.onClose();
  }

  render() {
    return (
      <Query query={GET_PROJECTS}>
        {({ loading, error, data }) => {
          let ModalBody;

          if ((loading && !data) || !Object.keys(data).length) {
            ModalBody = <ModalSkeleton />;
          } else {
            ModalBody = (
              <Fragment>
                <h1 className="Modal-title">Add build</h1>
                <div className="Modal-formControl">
                  <label className="Modal-formLabel">Project</label>
                  <select ref={this.repoRef} className="Modal-formInput">
                    {data.projects.map(({ name }) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="Modal-formControl">
                  <label className="Modal-formLabel">Branch</label>
                  <input
                    type="text"
                    className="Modal-formInput"
                    onChange={e => {
                        this.setState({
                            branchValue: e.target.value
                        });
                    }}
                    value={this.state.branchValue}
                  />
                </div>
                <div className="Modal-controls">
                  <Button onClick={this.onAddClick}>Add</Button>
                </div>
              </Fragment>
            );
          }

          return (
            <div className="Modal">
              <div className="Modal-body">
                <Link to="/">
                  <span className="Modal-dismiss">&times;</span>
                </Link>
                {ModalBody}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }
  render() {
    return createPortal(<ModalWithQuery {...this.props} />, this.el);
  }
}
