
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name,
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (isGroup) {
      if (!members || members.length < 2 || !name) {
        return new NextResponse("Invalid data", { status: 400 });
      }

      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup: true,
          users: {
            create: [
              ...members.map((m: { value: string }) => ({
                user: { connect: { id: m.value } },
              })),
              { user: { connect: { id: currentUser.id } } },
            ],
          },
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      newConversation.users.forEach((u) => {
        if (u.user.email) {
          pusherServer.trigger(u.user.email, "conversation:new", newConversation)
        }
      })

      return NextResponse.json(newConversation);
    }

    const existingConversation = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: currentUser.id,
              },
            },
          },
          {
            users: {
              some: {
                userId,
              },
            },
          },
        ],
        isGroup: false,
      },
      include: {
        users: true,
      },
    });

    const singleConversation = existingConversation[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        name: "", 
        isGroup: false,
        users: {
          create: [
            { user: { connect: { id: currentUser.id } } },
            { user: { connect: { id: userId } } },
          ],
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    newConversation.users.map((u) => {
      if (u.user.email) {
        pusherServer.trigger(u.user.email, "conversation:new", newConversation)
      }
    })

    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.error("POST /api/conversations error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
