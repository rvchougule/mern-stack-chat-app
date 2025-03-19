import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Message, Conversation } from "../models/message.model.js";

// user for explorer
export const getUsersForSidebar = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, filteredUsers, "User Fetched successfully."));
});

export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const userId = req.user?._id;

  if (!userToChatId) {
    throw new ApiError(401, "Invalid user chat id");
  }

  const messages = await Conversation.find({
    $or: [
      { senderId: userId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: userId },
    ],
  });

  if (!messages) {
    throw new ApiError(404, "Chats not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, messages, "chat fetched successfully."));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user?._id;
  const imagePath = req.file?.path;
  let imageUrl;

  if (imagePath) {
    const uploadResponse = await uploadOnCloudinary(imagePath);
    if (!uploadResponse) {
      throw new ApiError(500, "Image file not uploaded try after some time.");
    }
    imageUrl = uploadResponse?.url;
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  if (!newMessage) {
    throw new ApiError(501, "Message failed to send");
  }

  res.status(200).json(new ApiResponse(200, newMessage, "Message send"));
});
