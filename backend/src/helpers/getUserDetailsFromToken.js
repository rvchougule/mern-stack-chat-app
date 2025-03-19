import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserDetailsFromToken = asyncHandler(async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decode._id).select(
    "-password -refreshToken"
  );

  return user;
});
