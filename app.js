const express = require("express");
const { json, urlencoded } = require("express");
const routes = require("./routes/index");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_1_URL, process.env.FRONTEND_2_URL],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/posts", routes.posts);
app.use("/api/v1/users", routes.users);
app.use("/api/v1/accounts", routes.accounts);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ msg: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server is running on port ${PORT}`);
});
