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
        select: { id: true, title: true, createdAt: true },
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
    select: {
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
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
