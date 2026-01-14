

'use client'

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { User } from "@/app/generated/prisma";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const normalizedUsers = data.users.map((u: any) =>
    "user" in u ? u.user : u
  );
  const otherUser = useOtherUser({ ...data, users: normalizedUsers });

  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    if (messages.length === 0) return null;
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) return false;
    const seenArray = lastMessage.seen || [];
    return seenArray.some((seen: User) => seen.email === userEmail);
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (!lastMessage) return "Started a conversation";
    if (lastMessage.image) return "📷 Sent an image";
    if (lastMessage.body?.trim()) return lastMessage.body;
    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        gap-3
        mb-2
        p-3
        rounded-xl
        cursor-pointer
        transition
        bg-gradient-to-r from-blue-50 via-white to-blue-50
        hover:shadow-md
        hover:from-blue-100
        hover:to-blue-50
      `,
        selected ? "shadow-md bg-gradient-to-r from-blue-100 via-white to-blue-100" : ""
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 relative transition-transform duration-200 hover:scale-110">
        {data.isGroup ? (
          <AvatarGroup users={normalizedUsers} />
        ) : (
          <Avatar user={otherUser} />
        )}
      </div>

      {/* Conversation Info */}
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-md font-medium text-gray-900 truncate">
            {data.isGroup
              ? data.name || "Untitled group"
              : otherUser?.name || otherUser?.email || "Unknown user"}
          </p>
          {lastMessage?.createdAt && (
            <p className="text-xs text-gray-400 font-light">
              {format(new Date(lastMessage.createdAt), "p")}
            </p>
          )}
        </div>
        <p
          className={clsx(
            "truncate text-sm",
            hasSeen ? "text-gray-500" : "text-black font-medium"
          )}
        >
          {lastMessageText}
        </p>
      </div>
    </div>
  );
};

export default ConversationBox;
