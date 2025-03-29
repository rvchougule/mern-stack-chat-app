import { Conversation } from "../models/message.model.js";
export const getConversation = async (userId) => {
  try {
    if (!userId) return [];
    const userConversation = await Conversation.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: "messages",
      })
      .populate({
        path: "sender",
        select: "-password -refreshToken",
      })
      .populate({
        path: "receiver",
        select: "-password -refreshToken",
      });

    const conversation = userConversation?.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((acc, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== userId) {
          return acc + (curr?.seen ? 0 : 1);
        } else {
          return acc;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
  } catch (err) {
    console.log(err);
  }
};
