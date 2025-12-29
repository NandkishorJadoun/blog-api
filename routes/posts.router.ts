import { Router } from "express";
import passport from "../configs/passport.js"

import { validatePost, validateComment } from "../middlewares/validator.js";
import controller from "../controllers/posts.controller.js";

export const postsRouter = Router();

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
  validatePost,
  controller.createNewPost
);

postsRouter.post(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  validateComment,
  controller.createNewComment,
);

postsRouter.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  validatePost,
  controller.updatePostById,
);

postsRouter.put(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  validateComment,
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
