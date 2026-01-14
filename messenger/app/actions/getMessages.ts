import prisma from "@/app/libs/prismadb";
import { FullMessageType } from "../types";

const getMessages = async (
  conversationId: string
): Promise<FullMessageType[]> => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: true,
        seenBy: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((msg) => ({
      ...msg,
      seen: msg.seenBy.map((sb) => sb.user),
    }));
  } catch (error) {
    console.error("getMessages error:", error);
    return [];
  }
};

export default getMessages;
