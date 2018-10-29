import { ensureLoggedIn } from "connect-ensure-login";

export default function(condition) {
  return (req, res, next) => {
    if (condition) {
      return ensureLoggedIn("/login")(req, res, next);
    }

    next();
  };
}
