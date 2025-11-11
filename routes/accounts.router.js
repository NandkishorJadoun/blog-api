const { Router } = require("express");
const controller = require("../controllers/accounts.controller");

const accountsRouter = new Router();

accountsRouter.post("/signup", controller.postSignUpUser);
accountsRouter.post("/login", controller.postLogin);

module.exports = accountsRouter;
