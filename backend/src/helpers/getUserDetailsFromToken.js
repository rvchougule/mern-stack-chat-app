import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const getUserDetailsFromToken = async (token) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
};
