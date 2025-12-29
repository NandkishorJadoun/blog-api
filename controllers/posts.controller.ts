import prisma from "../configs/prisma.js";
import CustomForbiddenError from "../errors/CustomForbiddenError.js";
import CustomNotFoundError from "../errors/CustomNotFoundError.js";
import CustomUnauthorizedError from "../errors/CustomUnauthorizedError.js";
import { validationResult, matchedData } from "express-validator";
import type { Request, Response } from "express";

const getPosts = async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLIC",
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      authorId: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  res.status(200).json({ message: "Fetched Posts Successfully", data: posts });
};

const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  if (!post) {
    throw new CustomNotFoundError(`Post with ID ${postId} not found`);
  }

  res.json({ message: "Fetched The Post Successfully", data: post });
};

const getCommentsByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    include: {
      comments: {
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    throw new CustomNotFoundError(`Post with ID ${postId} not found`);
  }

  res.json({
    message: "Fetched all comments on the post",
    data: post.comments,
  });
};

const getAuthorPosts = async (req: Request, res: Response) => {

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }

  const { id } = req.user;

  const { type } = req.query;

  // TODO: figure out this later
  if (type !== "PUBLIC" && type !== "PRIVATE") {
    throw Error("type should PUBLIC or PRIVATE")
  }

  const posts = await prisma.post.findMany({
    where: { status: type, authorId: id },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ message: `Fetched All ${type} Posts Successfully`, data: posts });
};

const createNewPost = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, content } = matchedData(req);
  const { status } = req.body;

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }

  const { id } = req.user;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      status,
      authorId: id,
    },
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
};

const updatePostById = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }
  const { id } = req.user;
  const { postId } = req.params;
  const { status } = req.body;
  const { title, content } = matchedData(req);

  const existingPost = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!existingPost) {
    throw new CustomNotFoundError(`Post with ID ${postId} not found`);
  }

  if (existingPost.authorId !== id) {
    throw new CustomForbiddenError(
      "You are forbidden from updating this post",
    );
  }

  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: { title, content, status },
  });

  res.status(201).json({ message: "Post update Successfully", post });
};

const deletePostById = async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }

  const { id } = req.user;

  const existingPost = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!existingPost) {
    throw new CustomNotFoundError(`Post with ID ${postId} not found`);
  }

  if (existingPost.authorId !== id) {
    throw new CustomForbiddenError("You are forbidden from deleting this post");
  }

  await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.status(200).json({ message: "Post deleted successfully" });
};

const createNewComment = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { postId } = req.params;

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }

  const { id } = req.user;
  const { content } = matchedData(req);
  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: id,
      postId: Number(postId),
    },
  });

  res.status(201).json({ message: "Created Comment Successfully", data: comment });
}

const updateCommentOnPost = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }

  const { id } = req.user;

  const existingComment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });

  if (!existingComment) {
    throw new CustomNotFoundError(`Comment with ID ${commentId} not found`);
  }

  if (existingComment.authorId !== id) {
    throw new CustomForbiddenError(
      "You are forbidden from updating this comment",
    );
  }

  const comment = await prisma.comment.update({
    where: {
      id: Number(commentId),
      postId: Number(postId),
    },
    data: { content },
  });

  res.status(200).json({ message: "Comment Updated Successfully", data: comment });
};

const deleteCommentOnPost = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;

  if (!req.user) {
    throw new CustomUnauthorizedError("Unauthorized!")
  }

  const { id } = req.user;

  const existingComment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    include: { post: true },
  });

  if (!existingComment) {
    throw new CustomNotFoundError(`Comment with ID ${commentId} not found`);
  }

  const commentAuthor = existingComment.authorId;

  // TODO: fix this error
  if (existingComment.post === null) {
    throw Error("Post is Deleted")
  }
  const postAuthor = existingComment.post.authorId;

  if (id !== commentAuthor && id !== postAuthor) {
    throw new CustomForbiddenError(
      "You are forbidden from deleting this comment",
    );
  }

  const comment = await prisma.comment.delete({
    where: {
      id: Number(commentId),
      postId: Number(postId),
    },
  });

  res.json({
    message: "Comment Deleted Successfully",
    data: comment,
  });
};

export default {
  getPosts,
  getPostById,
  getAuthorPosts,
  getCommentsByPostId,
  deletePostById,
  createNewPost,
  updatePostById,
  createNewComment,
  updateCommentOnPost,
  deleteCommentOnPost,
};
