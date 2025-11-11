const postsRouter = require("./posts.router");
const usersRouter = require("./users.router");
const accountsRouter = require("./accounts.router");

module.exports = {
  posts: postsRouter,
  users: usersRouter,
  accounts: accountsRouter,
};
