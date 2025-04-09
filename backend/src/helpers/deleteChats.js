import mongoose from "mongoose";
import { Message, Conversation } from "../models/message.model.js";

export const deleteChats = async (data) => {
  try {
    const result = await Message.deleteMany({ _id: { $in: data } });
    console.log("Deleted Messages:", result);

    // Remove message references from Conversation
    await Conversation.updateMany(
      { messages: { $in: data } },
      { $pull: { messages: { $in: data } } }
    );
    console.log("Message references removed from conversations");
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};
