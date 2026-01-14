import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!message && !image) {
      return new NextResponse("Message or image required", { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message || "",
        image: image,
        conversationId: conversationId,
        senderId: currentUser.id,
      },
      include: {
        sender: true,
        seenBy: {
          include: {
            user: true, 
          },
        },
      },
    });

    await prisma.userSeenMessage.upsert({
      where: {
        userId_messageId: {
          userId: currentUser.id,
          messageId: newMessage.id,
        },
      },
      create: {
        userId: currentUser.id,
        messageId: newMessage.id,
      },
      update: {},
    });

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    updatedConversation.users.forEach(({ user }) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:update", {
          id: conversationId,
          messages: [newMessage], 
        });
      }
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error("ERROR_MESSAGES", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
