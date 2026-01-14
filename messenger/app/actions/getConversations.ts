import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"

const getConversations = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        users: {
          some: {
            userId: currentUser.id,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
            seenBy: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return conversations.map((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => ({
        ...message,
        seen: message.seenBy.map((s) => s.user),
      })),
    }));

    } catch (error: any) {
        return [];
    }
}

export default getConversations;