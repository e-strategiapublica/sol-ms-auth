import express from "express";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import testRouter from "./routes/test.routes";
import { ErrorHandlingMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/", authRouter);

// Test routes (only available in development)
if (process.env.NODE_ENV === "development") {
  app.use("/test", testRouter);
  console.log("🧪 Test routes enabled at /test (development mode)");
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Global error handling
app.use(ErrorHandlingMiddleware);

export default app;
