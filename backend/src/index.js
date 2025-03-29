import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import { getUserDetailsFromToken } from "./helpers/getUserDetailsFromToken.js";
import { User } from "./models/user.model.js";
import { Conversation, Message } from "./models/message.model.js";
import { getConversation } from "./helpers/getConversation.js";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";
import { uploadOnCloudinary } from "./utils/cloudinary.js";
import { fileURLToPath } from "url";

dotenv.config({ path: "./.env" });

// MongoDB Connection Callback

connectDB().then(() => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT || 8080}`);
  });

  // online user
  const onlineUser = new Set();

  io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.auth.token;

      // current user details
      const user = await getUserDetailsFromToken(token);

      // create Room
      socket.join(user?._id?.toString());
      onlineUser.add(user?._id?.toString());

      socket.on("message-page", async (userId) => {
        try {
          const userDetails = await User.findById(userId).select(
            "-password -refreshToken"
          );
          const payload = {
            _id: userDetails?._id,
            fullName: userDetails?.fullName,
            email: userDetails?.email,
            profile_img: userDetails?.profile_img,
            online: onlineUser.has(userId),
          };
          socket.emit("message-user", payload);

          //get previous message
          const getConversationMessage = await Conversation.findOne({
            $or: [
              { sender: user?._id, receiver: userId },
              { sender: userId, receiver: user?._id },
            ],
          })
            .populate("messages")
            .sort({ updatedAt: -1 });

          socket.emit("message", getConversationMessage?.messages || []);
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("file-upload", async ({ filename, data }) => {
        try {
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const publicDir = path.join(__dirname, "public");

          // Ensure the public folder exists
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }

          const tempFilePath = path.join(publicDir, filename);
          console.log(__filename, __dirname, publicDir, tempFilePath);
          console.log(filename, data);

          // Save the file temporarily
          fs.writeFileSync(tempFilePath, Buffer.from(new Uint8Array(data)));

          // Upload to Cloudinary
          const cloudinaryResponse = await uploadOnCloudinary(
            tempFilePath,
            "chat-app"
          );
          if (!cloudinaryResponse) {
            socket.emit("upload-error", {
              message: "Cloudinary upload failed",
            });
            return;
          }

          console.log("File uploaded to Cloudinary:", cloudinaryResponse?.url);

          // Emit success message with Cloudinary file URL
          socket.emit("upload-success", {
            message: "File uploaded successfully",
            url: cloudinaryResponse?.url,
          });
        } catch (error) {
          console.error("File upload error:", error);
          socket.emit("upload-error", { message: "File upload failed" });
        }
      });

      //new message
      socket.on("new-message", async (data) => {
        try {
          //check conversation is available both user

          let conversation = await Conversation.findOne({
            $or: [
              { sender: data?.sender, receiver: data?.receiver },
              { sender: data?.receiver, receiver: data?.sender },
            ],
          });

          //if conversation is not available
          if (!conversation) {
            const createConversation = await Conversation({
              sender: data?.sender,
              receiver: data?.receiver,
            });
            conversation = await createConversation.save();
          }

          const message = new Message({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId,
          });
          const saveMessage = await message.save();

          const updateConversation = await Conversation.updateOne(
            { _id: conversation?._id },
            {
              $push: { messages: saveMessage?._id },
            }
          );

          const getConversationMessage = await Conversation.findOne({
            $or: [
              { sender: data?.sender, receiver: data?.receiver },
              { sender: data?.receiver, receiver: data?.sender },
            ],
          })
            .populate("messages")
            .sort({ updatedAt: -1 });

          io.to(data?.sender).emit(
            "message",
            getConversationMessage?.messages || []
          );
          io.to(data?.receiver).emit(
            "message",
            getConversationMessage?.messages || []
          );

          //send conversation
          const conversationSender = await getConversation(data?.sender);
          const conversationReceiver = await getConversation(data?.receiver);

          io.to(data?.sender).emit("conversation", conversationSender);
          io.to(data?.receiver).emit("conversation", conversationReceiver);
        } catch (error) {
          console.log(error);
        }
      });

      //sidebar
      socket.on("sidebar", async (currentUserId) => {
        console.log("current user", currentUserId);

        const conversation = await getConversation(currentUserId);

        socket.emit("conversation", conversation);
      });

      socket.on("seen", async (msgByUserId) => {
        try {
          let conversation = await Conversation.findOne({
            $or: [
              { sender: user?._id, receiver: msgByUserId },
              { sender: msgByUserId, receiver: user?._id },
            ],
          });

          const conversationMessageId = conversation?.messages || [];

          const updateMessages = await Message.updateMany(
            { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
            { $set: { seen: true } }
          );

          //send conversation
          const conversationSender = await getConversation(
            user?._id?.toString()
          );
          const conversationReceiver = await getConversation(msgByUserId);

          io.to(user?._id?.toString()).emit("conversation", conversationSender);
          io.to(msgByUserId).emit("conversation", conversationReceiver);
        } catch (error) {
          console.log(error);
        }
      });

      //disconnect
      socket.on("disconnect", () => {
        onlineUser.delete(user?._id?.toString());
        console.log("disconnect user ", socket.id);
      });
    } catch (error) {
      console.log(error);
    }
  });
});
