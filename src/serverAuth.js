import passport from "passport";
import Auth0Strategy from "passport-auth0";

const strategy = new Auth0Strategy(
  {
    domain: process.env.RAZZLE_AUTH0_DOMAIN,
    clientID: process.env.RAZZLE_AUTH0_CLIENTID,
    clientSecret: process.env.RAZZLE_AUTH0_CLIENTSECRET,
    callbackURL: process.env.RAZZLE_AUTH0_CALLBACK
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default function addAuthMiddleware(server) {
  return server
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