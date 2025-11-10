const prisma = require("./prisma");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require("dotenv").config();

// gotta refactor this after adding bcrypt for hashing pw.
// then it can return errors for

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      const user = await prisma.user.findUnique({
        where: { email, password },
      });
      if (!user) {
        return cb(null, false, { message: "Incorrect Email or Password" });
      }
      return cb(null, user, { message: "Logged in successfully" });
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async (jwtPayload, cb) => {
      const user = await prisma.user.findUnique({
        where: {
          id: jwtPayload.id,
        },
      });

      if (user) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    },
  ),
);

module.exports = passport;
