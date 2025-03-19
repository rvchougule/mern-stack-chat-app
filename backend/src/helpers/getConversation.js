import { Conversation } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getConversation = asyncHandler(async (userId) => {
  if (!userId) return [];

  const userConversation = await Conversation.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ updatedAt: -1 })
    .populate("messages")
    .populate("sender")
    .populate("receiver");

  const conversation = userConversation?.map((conv) => {
    const countUnseenMsg = conv?.messages?.reduce((acc, curr) => {
      const msgByUserId = curr?.msgByUserId?.toString();

      if (msgByUserId !== currentUserId) {
        return preve + (curr?.seen ? 0 : 1);
      } else {
        return preve;
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
});
