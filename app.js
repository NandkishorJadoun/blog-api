const express = require("express");
const { json, urlencoded } = require("express");
const routes = require("./routes/index");
require("dotenv").config();

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/posts", routes.posts);
app.use("/api/v1/users", routes.users);
app.use("/api/v1/accounts", routes.accounts);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server is running on port ${PORT}`);
});
