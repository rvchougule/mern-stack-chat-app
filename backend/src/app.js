import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

import authRouter from "./routes/auth.routes.js";

// Routes

app.use("/api/auth/", authRouter);
