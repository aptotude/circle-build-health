import React from "react";
import "./Home.css";
import LastBuild from "./LastBuild";
import AddBuild from "./AddBuild";

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        {this.props.builds.map(build => (
          <LastBuild
            key={`${build.projectName}-${build.branch}`}
            name={build.projectName}
            branch={build.branch}
            onRemoveClick={this.props.onRemoveBuild}
          />
        ))}
        <AddBuild />
      </div>
    );
  }
}

export default Home;
