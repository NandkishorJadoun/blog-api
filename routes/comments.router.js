const { Router } = require("express");
const controller = require("../controllers/comments.controller");
const commentsRouter = new Router();

commentsRouter.get("/", controller.getAllComment);

module.exports = commentsRouter;
