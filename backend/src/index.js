import express from "express";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.listen(8000, () => {
  console.log("listening on", 8000);
});

// Routes

app.use("/api/auth/", authRouter);
