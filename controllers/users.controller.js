const prisma = require("../configs/prisma");

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  res.json({ message: "Fetched User Successfully", data: user });
};

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  const posts = await prisma.post.findMany({
    where: {
      authorId: Number(id),
    },
  });

  res.json({ message: "Fetched User Posts Successfully", data: posts });
};

const getUserComments = async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: {
      authorId: Number(id),
    },
  });

  res.json({ message: "Fetched User Comments Successfully", data: comments });
};

module.exports = { getUserById, getUserPosts, getUserComments };
