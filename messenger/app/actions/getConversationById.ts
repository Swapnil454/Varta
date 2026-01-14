import prisma from "@/app/libs/prismadb";
import { FullConversationType } from "../types";

const getConversationById = async (
  conversationId: string
): Promise<FullConversationType | null> => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: {
          include: { user: true },
        },
        messages: {
          include: {
            sender: true,
            seenBy: {
              include: { user: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) return null;

    return {
      ...conversation,
      messages: conversation.messages.map((msg) => ({
        ...msg,
        seen: msg.seenBy.map((sb) => sb.user),
      })),
    };
  } catch (error) {
    console.error("getConversationById error:", error);
    return null;
  }
};


export default getConversationById;
