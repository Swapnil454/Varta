import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";


interface IParams {
    conversationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: {
                include: {
                    user: true,   // bring in actual user data
                },
                },
            },
        });


        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                users: {
                    some: {
                        userId: currentUser.id,
                    }
                }
            }
        });

        existingConversation.users.forEach((u) => {
            if (u.user.email) {
                pusherServer.trigger(u.user.email, 'conversation:remove', existingConversation);
            }
        })

        return NextResponse.json(deleteConversation);
        
    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE');
        return new NextResponse('Internal Error', { status: 500 });
    }
}