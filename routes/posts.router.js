const { Router } = require("express");
const controller = require("../controllers/posts.controller");

const postsRouter = new Router();

postsRouter.get("/", controller.getPosts);
postsRouter.get("/:postId", controller.getPostById);
postsRouter.get("/:postId/comments", controller.getCommentsByPostId);

postsRouter.post("/", controller.createNewPost);
postsRouter.post("/:postId/comments", controller.createNewComment);

postsRouter.put("/:postId", controller.updatePostById);
postsRouter.put("/:postId/comments/:commentId", controller.updateCommentOnPost);

postsRouter.delete("/:postId", controller.deletePostById);
postsRouter.delete(
  "/:postId/comments/:commentId",
  controller.deleteCommentOnPost,
);

module.exports = postsRouter;
