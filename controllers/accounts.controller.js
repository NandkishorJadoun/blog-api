require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");
const passport = require("../configs/passport");
const validate = require("../middlewares/validator");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { validationResult, matchedData } = require("express-validator");

const postSignUpUser = [
  validate.signUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password } = matchedData(req);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      throw new CustomNotFoundError("Hashed Password not found");
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.json({
      message: "User created successfully",
      data: user,
    });
  },
];

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
