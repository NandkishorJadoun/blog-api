const postsRouter = require("./posts.router");
const usersRouter = require("./users.router");

module.exports = {
  posts: postsRouter,
  users: usersRouter,
};
