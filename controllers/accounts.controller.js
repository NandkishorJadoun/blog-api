const prisma = require("../configs/prisma");
const jwt = require("jsonwebtoken");
const passport = require("../configs/passport");
require("dotenv").config();

// add validation and hashing through bcrypt later
const postSignUpUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  res.json({
    message: "User created successfully",
    data: user,
  });
};

const postLogin = async (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        info,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) return res.send(err);
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
      return res.json({ user, token });
    });
  })(req, res);
};

module.exports = { postSignUpUser, postLogin };
