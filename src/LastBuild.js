import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Repo from './Repo';
import RepoSkeleton from "./RepoSkeleton";

const POLL_CIRCLE_INTERVAL = 30 * 1000;

const GET_LAST_BUILD = gql`
  query lastBuildFor($name: String, $branch: String) {
    lastBuildFor(name: $name, branch: $branch) {
      buildNumber
      buildUrl
      name
      status
      committers
      lifecycle
    }
  }
`;

export default ({ name, branch = "master", onRemoveClick }) => (
  <Query pollInterval={POLL_CIRCLE_INTERVAL} query={GET_LAST_BUILD} variables={{ name, branch }}>
    {({ loading, error, data }) => {
      if (loading || !data || !Object.keys(data).length) {
        return <RepoSkeleton name={name} />;
      }

      if (error) {
        return `Error: ${error}`;
      }

      return (
        <Repo {...data.lastBuildFor} branch={branch} onRemoveClick={onRemoveClick} />
      );
    }}
  </Query>
);
