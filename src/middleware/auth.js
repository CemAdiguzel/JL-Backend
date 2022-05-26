import { ExtractJwt, Strategy as BaseJwtStrategy } from "passport-jwt";
import { User } from "../entities/User";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "SECRET",
};

export default new BaseJwtStrategy(opts, function (jwtPayload, done) {
  User.findOne({ where: { id: jwtPayload.id } }).then(function (user, err) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});
