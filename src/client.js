import App from "./App";
import BrowserRouter from "react-router-dom/BrowserRouter";
import React from "react";
import { hydrate } from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: createHttpLink({
    uri: "/graphql",
    credentials: "same-origin"
  }),
  cache: cache.restore(window.__APOLLO_STATE__)
});

class LocalStorageAdapter {
  static key = 'circle-build-health-builds';

  static get() {
    const builds = localStorage && localStorage.getItem(LocalStorageAdapter.key);
    if (builds) {
      return JSON.parse(builds);
    }

    return [];
  }

  static set(builds) {
    const serializedBuilds = JSON.stringify(builds);
    localStorage && localStorage.setItem(LocalStorageAdapter.key, serializedBuilds);
  }
}

hydrate(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App getBuilds={LocalStorageAdapter.get} setBuilds={LocalStorageAdapter.set} />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
