const prisma = require("../configs/prisma");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const CustomForbiddenError = require("../errors/CustomForbiddenError");
const validate = require("../middlewares/validator");
const { validationResult, matchedData } = require("express-validator");

const getPosts = async (_req, res) => {
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
  res.json({ message: "Fetched Posts Successfully", data: posts });
};

const getPostById = async (req, res) => {
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

const getCommentsByPostId = async (req, res) => {
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

const getAuthorPosts = async (req, res) => {
  const { id } = req.user;
  const { type } = req.query;

  const posts = await prisma.post.findMany({
    where: { status: type, authorId: id },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({ message: `Fetched All ${type} Posts Successfully`, data: posts });
};

const createNewPost = [
  validate.post,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, content } = matchedData(req);
    const { status } = req.body;
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
  },
];

const updatePostById = [
  validate.post,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

    res.json({ message: "Post update Successfully", post });
  },
];

const deletePostById = async (req, res) => {
  const { postId } = req.params;
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
  res.json({ message: "Post deleted successfully" });
};

const createNewComment = [
  validate.comment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { postId } = req.params;
    const { id } = req.user;
    const { content } = matchedData(req);
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: id,
        postId: Number(postId),
      },
    });

    res.json({ message: "Created Comment Successfully", data: comment });
  },
];

const updateCommentOnPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
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

  res.json({ message: "Comment Updated Successfully", data: comment });
};

const deleteCommentOnPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { id } = req.user;

  const existingComment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    include: { post: true },
  });

  if (!existingComment) {
    throw new CustomNotFoundError(`Comment with ID ${commentId} not found`);
  }

  const commentAuthor = existingComment.authorId;
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

module.exports = {
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
