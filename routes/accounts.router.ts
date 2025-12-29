import { Router } from "express";
import controller from "../controllers/accounts.controller.js"
import { validateSignUp } from "../middlewares/validator.js";

export const accountsRouter = Router();

accountsRouter.post("/signup", validateSignUp, controller.postSignUpUser);
accountsRouter.post("/login", controller.postLogin);