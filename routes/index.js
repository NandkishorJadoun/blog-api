const postsRouter = require("./posts.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");

module.exports = {
  posts: postsRouter,
  comments: commentsRouter,
  users: usersRouter,
};
