import { Router } from "express";
import controller from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get("/:id", controller.getUserById);
usersRouter.get("/:id/posts", controller.getUserPosts);
usersRouter.get("/:id/comments", controller.getUserComments);