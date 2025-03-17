import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/users", verifyJwt, getUsersForSidebar);
router.get("/:id", verifyJwt, getMessages);

router.post("/send/:id", verifyJwt, sendMessage);

export default router;
