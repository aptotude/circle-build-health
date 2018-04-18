import React, { Fragment, Component } from "react";
import Route from "react-router-dom/Route";
import Switch from "react-router-dom/Switch";
import Home from "./Home";
import AddBuildModal from "./AddBuildModal";

import "./App.css";

export default class extends Component {
  static defaultProps = {
    getBuilds: () => [],
    setBuilds: () => {}
  };

  state = {
    builds: this.props.getBuilds()
  };

  dispatch = ({ type, payload }) => {
    let nextState = { ...this.state };
    switch (type) {
      case "ADD_BUILD":
        nextState = {
          ...nextState,
          builds: nextState.builds.concat([
            {
              projectName: payload.projectName,
              branch: payload.branch
            }
          ])
        };
        break;
      case "REMOVE_BUILD":
        nextState = {
          ...nextState,
          builds: nextState.builds.filter(
            build => {
              if (build.projectName === payload.projectName) {
                if (build.branch === payload.branch) {
                  return false;
                }
              }

              return true;
            } 
          )
        };
        break;
      default:
        break;
    }

    this.setState(nextState);
    this.props.setBuilds(nextState.builds);
  };

  addBuild = (projectName, branch) => {
    this.dispatch({
      type: "ADD_BUILD",
      payload: {
        projectName,
        branch
      }
    });
  };

  removeBuild = (projectName, branch) => {
    this.dispatch({
      type: "REMOVE_BUILD",
      payload: {
        projectName,
        branch
      }
    });
  };

  updateBuild = (projectName, branch) => {
    this.dispatch({
      type: "UPDATE_BUILD",
      payload: {
        projectName,
        branch
      }
    });
  };

  render() {
    return (
      <Fragment>
        <Switch>
          <Route
            path="/"
            render={props => (
              <Home
                {...props}
                onRemoveBuild={this.removeBuild}
                builds={this.state.builds}
              />
            )}
          />
        </Switch>
        <Route
          path="/add-build"
          render={props => (
            <AddBuildModal
              onClose={props.history.goBack}
              onAdd={this.addBuild}
            />
          )}
        />
      </Fragment>
    );
  }
}
