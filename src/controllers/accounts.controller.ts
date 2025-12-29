import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../configs/prisma.js";
import passport from "../configs/passport.js";
import CustomNotFoundError from "../errors/CustomNotFoundError.js";
import { validationResult, matchedData } from "express-validator";
import type { AuthUser } from "../types/express.js";
import type { Request, Response } from "express";

const postSignUpUser = async (req: Request, res: Response) => {
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
};

const postLogin = async (req: Request, res: Response) => {
  passport.authenticate("local", { session: false }, (err: unknown, user: AuthUser, info: { message: string }) => {
    if (err || !user) {
      return res.status(400).json({ info });
    }

    console.log("USER: ", user)

    req.login(user, { session: false }, (err) => {
      if (err) return res.send(err);
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY!);
      return res.json({ user, token });
    });
  })(req, res);
};

export default { postSignUpUser, postLogin };
