import express from "express";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/", authRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
