const { Router } = require("express");
const controller = require("../controllers/posts.controller");

const postsRouter = new Router();

postsRouter.get("/", controller.getPosts);
postsRouter.get("/:id", controller.getPostById);
postsRouter.get("/:id/comments", controller.getCommentsByPostId);

postsRouter.post("/", controller.createNewPost);

postsRouter.put("/:id", controller.updatePostById)

postsRouter.delete("/:id", controller.deletePostById);

module.exports = postsRouter;
