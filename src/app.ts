import express, { type ErrorRequestHandler } from "express";
import cors from "cors"
import 'dotenv/config';
import routes from "./routes/index.js";

const app = express();

const corsOptions: { origin: string[], credentials: boolean } = {
  origin: [process.env.FRONTEND_1_URL!, process.env.FRONTEND_2_URL!],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/posts", routes.posts);
app.use("/api/v1/users", routes.users);
app.use("/api/v1/accounts", routes.accounts);

// TODO: separate this function in Errors File
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ msg: err.message });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
