const prisma = require("../configs/prisma");

const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json({ message: "Fetched Posts Successfully", data: posts });
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json({ message: "Fetched The Post Successfully", data: post });
};

const getCommentsByPostId = async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId: Number(id) },
  });
  res.json({ message: "Fetched all comments on the post", data: comments });
};

const deletePostById = async (req, res) => {
  const { id } = req.params;
  await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.json({ message: "Post deleted successfully" });
};

// Add Validation for creating post

const createNewPost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: id,
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
  const { id } = req.params;
  const { title, content, status } = req.body;

  const post = await prisma.post.update({
    where: { id },
    data: { title, content, status },
  });

  res.json({
    message: "Post update Successfully",
    post,
  });
};

module.exports = {
  getPosts,
  getPostById,
  getCommentsByPostId,
  deletePostById,
  createNewPost,
  updatePostById,
};
