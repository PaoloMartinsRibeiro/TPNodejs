import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(opts, (jwt_payload, done) => {
    if (jwt_payload.user) {
      return done(null, jwt_payload.user);
    }

    return done(null, false);
  })
);

export default passport;