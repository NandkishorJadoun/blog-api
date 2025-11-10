const { Router } = require("express");
const controller = require("../controllers/users.controller");
const usersRouter = new Router();

usersRouter.get("/:id", controller.getUserById);
usersRouter.get("/:id/posts", controller.getUserPosts);
usersRouter.get("/:id/comments", controller.getUserComments);

module.exports = usersRouter;
