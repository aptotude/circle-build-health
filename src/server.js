import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { ensureLoggedIn } from "connect-ensure-login";

import CircleCI from "circleci";

import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { ApolloProvider, renderToStringWithData } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache } from "apollo-cache-inmemory";
import passport from "./serverAuth";

const APTO_ORGANIZATION_NAME = "aptotude";

const circleClient = new CircleCI({
  auth: process.env.RAZZLE_CIRCLE_CI_TOKEN
});

const typeDefs = `
  type Query {
    lastBuildFor(name: String, branch: String): Build,
    projects: [Project]
  }

  type Project {
    name: String
  }

  type Build {
    buildNumber: String,
    buildUrl: String,
    name: String,
    status: String,
    committers: [String]
    lifecycle: String
  }
`;

const resolvers = {
  Query: {
    lastBuildFor: async (root, { name, branch }) => {
      try {
        const builds = await circleClient.getBranchBuilds({
          limit: 1,
          username: "aptotude",
          project: name,
          branch
        });

        return builds[0];
      } catch (ex) {
        console.error(ex.message);
        throw ex;
      }
    },
    projects: async () => {
      try {
        const allProjects = await circleClient.getProjects();

        const aptoProjects = allProjects.filter(
          project => project.username === APTO_ORGANIZATION_NAME
        );

        return aptoProjects;
      } catch (ex) {
        console.error(ex.message);
        throw ex;
      }
    }
  },

  Project: {
    name: root => root.reponame
  },

  Build: {
    buildNumber: root => root.build_num,
    buildUrl: root => root.build_url,
    name: root => root.reponame,
    committers: root => {
      if (!root.all_commit_details) {
        return null;
      }

      const names = root.all_commit_details.reduce((agg, commit) => {
        console.log(commit);
        return agg.add(commit.author_login);
      }, new Set());
      return [...names];
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const client = new ApolloClient({
  ssrMode: true,
  link: new SchemaLink({
    schema
  }),
  cache: new InMemoryCache()
});

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

let server = express();

server = server
  .disable("x-powered-by")
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(
    session({
      secret: "shhhhhhhhh",
      resave: true,
      saveUninitialized: true
    })
  );

if (process.env.RAZZLE_USE_AUTH0 === "true") {
  server = server
    .use(passport.initialize())
    .use(passport.session())
    .get(
      "/callback",
      passport.authenticate("auth0", {
        failureRedirect: "/failure"
      }),
      function(req, res) {
        res.redirect("/");
      }
    )
    .get("/login", passport.authenticate("auth0", {}));
}

server = server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(
    "/graphql",
    (req, res, next) => {
      if (process.env.RAZZLE_USE_AUTH0 === "true") {
        return ensureLoggedIn("/login")(req, res, next);
      }

      next();
    },
    bodyParser.json(),
    graphqlExpress({ schema })
  )
  .get(
    "/",
    (req, res, next) => {
      if (process.env.RAZZLE_USE_AUTH0 === "true") {
        return ensureLoggedIn("/login")(req, res, next);
      }

      next();
    },
    async (req, res) => {
      const context = {};
      const app = (
        <ApolloProvider client={client}>
          <StaticRouter context={context} location={req.url}>
            <App />
          </StaticRouter>
        </ApolloProvider>
      );
      const markup = await renderToStringWithData(app);
      const apolloState = client.extract();

      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(
          `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <title>Apto CircleCI Build Health</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
    <script>
    window.__APOLLO_STATE__=${JSON.stringify(apolloState).replace(
      /</g,
      "\\u003c"
    )}
</script>
</html>`
        );
      }
    }
  );

if (process.env.NODE_ENV === "development") {
  server.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
}

export default server;
