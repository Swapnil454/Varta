
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { pusherServer } from "@/libs/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const lastMessage = await prisma.message.findFirst({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastMessage) {
      return NextResponse.json({ message: "No messages" });
    }

    
    await prisma.userSeenMessage.upsert({
      where: {
        userId_messageId: {
          userId: currentUser.id,
          messageId: lastMessage.id,
        },
      },
      create: {
        userId: currentUser.id,
        messageId: lastMessage.id,
      },
      update: {},
    });

    
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: { include: { user: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: true,
            seenBy: { include: { user: true } },
          },
        },
      },
    });

    if (!updatedConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const latestMessage = updatedConversation.messages[0];

    const transformedMessage = {
      ...latestMessage,
      seen: latestMessage.seenBy.map((sb) => sb.user),
    };

    updatedConversation.users.forEach((u) => {
      if (u.user.email) {
        pusherServer.trigger(u.user.email, "conversation:update", {
          ...updatedConversation,
          messages: [
            {
              ...transformedMessage,
            },
          ],
        });
      }
    });

    await pusherServer.trigger(conversationId, "messages:update", transformedMessage);

    return NextResponse.json(transformedMessage);
  } catch (error) {
    console.error("SEEN ROUTE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
