
'use client'

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) return current;
        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current
          .map((c) =>
            c.id === conversation.id
              ? { ...c, lastMessageAt: conversation.lastMessageAt, messages: conversation.messages }
              : c
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
          )
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => current.filter((c) => c.id !== conversation.id));
      if (conversationId === conversation.id) router.push("/users");
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  // Filter conversations
  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();
    const name = item.name ?? "";
    const lastMessage = item.messages?.[item.messages.length - 1]?.body ?? "";
    const participants = item.users?.map((u) => u.user.name ?? "").join(" ").toLowerCase() ?? "";
    return name.toLowerCase().includes(query) || lastMessage.toLowerCase().includes(query) || participants.includes(query);
  });

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <aside
        className={clsx(
          `
          fixed inset-y-0
          lg:left-20 lg:w-80 w-full
          border-r border-gray-200
          flex flex-col
          bg-gradient-to-b from-blue-50 via-gray-50 to-blue-50
          shadow-sm
          transition-transform duration-300
        `,
          isOpen ? "translate-x-[-100%] lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-5 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-neutral-800">Messages</h2>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <ConversationBox data={item} selected={conversationId === item.id} />
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
