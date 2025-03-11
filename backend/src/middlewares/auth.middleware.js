import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "").trim();

    if (!token) {
      console.log("Unauthorized access");
      res.status(401).json({ message: "Unauthorized access" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      res.status(404).json({ message: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: error.message || "Invalid access Token" });
  }
};
