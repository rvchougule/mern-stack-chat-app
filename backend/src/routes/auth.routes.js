import express from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  logout,
  refreshToken,
  signup,
  updateAccountDetails,
  updateProfleImg,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User auth Routes
router.route("/signup").post(upload.single("profile_img"), signup);
router.route("/login").post(login);

// Protected Routes
router.route("/logout").post(verifyJwt, logout);
router.route("/refresh-token").post(verifyJwt, refreshToken);

// bug in password change
router.route("/change-password").post(verifyJwt, changePassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);

router
  .route("/update-profile")
  .patch(verifyJwt, upload.single("profile_img"), updateProfleImg);

export default router;
