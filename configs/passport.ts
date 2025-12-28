import 'dotenv/config'
import prisma from './prisma.js';
import passport from 'passport'
import bcrypt from 'bcryptjs';
import passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return cb(null, false, {
          message: "Incorrect email.",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return cb(null, false, {
          message: "Invalid password.",
        });
      }

      return cb(null, user, { message: "Logged in successfully" });
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY!,
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

export default passport;
