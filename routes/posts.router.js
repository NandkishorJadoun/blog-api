const { Router } = require("express");
const passport = require("../configs/passport");
const controller = require("../controllers/posts.controller");

const postsRouter = new Router();

postsRouter.get("/", controller.getPosts);

postsRouter.get(
  "/author",
  passport.authenticate("jwt", { session: false }),
  controller.getAuthorPosts,
);

postsRouter.get("/:postId", controller.getPostById);
postsRouter.get("/:postId/comments", controller.getCommentsByPostId);

postsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.createNewPost,
);

postsRouter.post(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  controller.createNewComment,
);

postsRouter.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  controller.updatePostById,
);

postsRouter.put(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  controller.updateCommentOnPost,
);

postsRouter.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  controller.deletePostById,
);

postsRouter.delete(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  controller.deleteCommentOnPost,
);

module.exports = postsRouter;
