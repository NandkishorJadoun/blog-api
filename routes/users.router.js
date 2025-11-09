const { Router } = require("express");
const controller = require("../controllers/users.controller");
const usersRouter = new Router();

usersRouter.get("/", controller.getAllUsers);

module.exports = usersRouter;
