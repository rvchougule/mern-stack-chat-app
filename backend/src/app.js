import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => res.send("Testing"));

import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/messages.routes.js";
import { ApiError } from "./utils/ApiError.js";

// Routes

app.use("/api/auth/", authRouter);
app.use("/api/message/", messageRouter);

// Error middleware to modify the structure
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    err.status = err.status || "error";
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      data: err.data,
      errors: err.errors,
      success: err.success,
    });
  }
});

export { app };
