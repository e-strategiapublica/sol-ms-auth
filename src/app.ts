import express from "express";
import userRouter from "./routes/user.routes.js";
import { ErrorHandlingMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use(ErrorHandlingMiddleware);

export default app;
