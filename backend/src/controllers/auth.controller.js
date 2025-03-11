import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ ValidateBeforeSave: false });
  return { accessToken, refreshToken };
};
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  if (!email || !fullName || !password) {
    return res.status(401).json({ message: "All fields are required" });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.status(401).json({ message: "User with email already exists!" });
  }

  const profileImgPath = req.file?.path;

  if (!profileImgPath) {
    res.status(401).json({ message: "Profile img required" });
  }

  const profile_img = await uploadOnCloudinary(profileImgPath);

  if (!profile_img) {
    res.status(501).json({ message: "Failed to upload profile_img" });
  }

  const user = await User.create({
    fullName,
    email,
    profile_img: profile_img?.url,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password",
    "-refreshToken"
  );

  if (!createUser) {
    res.status(501).json({ message: "Somethign went wrong while sign up." });
  }

  return res.status(201).json({ message: "User sign up successfully !" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    res.status(401).json({ message: "Invalid Credentials!" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "User doen not exist." });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid user credentials" });
  }

  const { accessToken, refreshToken } = await generateAccessTokenRefreshToken(
    user._id
  );

  const loggedUser = await User.findById(user._id).select(
    "-password",
    "-refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      data: {
        user: loggedUser,
        accessToken,
        refreshToken,
      },
      message: "User logged in successfully !",
    });
};

export const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpsOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
};
