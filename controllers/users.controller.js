const prisma = require("../configs/prisma");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  if (!user) {
    throw new CustomNotFoundError(`User with ID ${id} not found`);
  }

  res.json({ message: "Fetched User Successfully", data: user });
};

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      posts: {
        where: {
          status: "PUBLIC",
        },
      },
    },
  });

  if (!user) {
    throw new CustomNotFoundError(`User with ID ${id} not found`);
  }

  res.json({
    message: "Fetched User Posts Successfully",
    data: user.posts,
  });
};

const getUserComments = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { comments: true },
  });

  if (!user) {
    throw new CustomNotFoundError(`User with ID ${id} not found`);
  }

  res.json({
    message: "Fetched User Comments Successfully",
    data: user.comments,
  });
};

module.exports = { getUserById, getUserPosts, getUserComments };
