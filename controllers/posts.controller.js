const prisma = require("../configs/prisma");

const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json({ message: "Fetched Posts Successfully", data: posts });
};

const getPostById = async (req, res) => {
  const { postId } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });
  res.json({ message: "Fetched The Post Successfully", data: post });
};

const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
  });
  res.json({ message: "Fetched all comments on the post", data: comments });
};

const deletePostById = async (req, res) => {
  const { postId } = req.params;
  await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.json({ message: "Post deleted successfully" });
};

// Add Validation for creating post

const createNewPost = async (req, res) => {
  const { title, content, authorId } = req.body;

  // I'll use this to get the author id
  // const { id } = req.user;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
};

// currently I am using post id for updating, i have no idea if other authenticated user can update as well.
// if they can, i'll use req.user.id as well for extra security

const updatePostById = async (req, res) => {
  const { postId } = req.params;
  const { title, content, status } = req.body;

  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: { title, content, status },
  });

  res.json({
    message: "Post update Successfully",
    post,
  });
};

// currently getting author id through req body but after auth, you have to change that

const createNewComment = async (req, res) => {
  const { postId } = req.params;
  const { content, authorId } = req.body;
  const comment = await prisma.comment.create({
    data: {
      postId: Number(postId),
      content,
      authorId,
    },
  });

  res.json({ message: "Created Comment Successfully", data: comment });
};

const updateCommentOnPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
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
  const comment = await prisma.comment.delete({
    where: {
      id: Number(commentId),
      postId: Number(postId),
    },
  });

  res.json({ message: "Comment Deleted Successfully", data: comment });
};

module.exports = {
  getPosts,
  getPostById,
  getCommentsByPostId,
  deletePostById,
  createNewPost,
  updatePostById,
  createNewComment,
  updateCommentOnPost,
  deleteCommentOnPost,
};
