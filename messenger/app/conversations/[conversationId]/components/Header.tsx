
'use client'

import Avatar from "@/components/Avatar";
import { Conversation, User, UserConversation } from "@/generated/prisma";
import useOtherUser from "@/hooks/useOtherUser";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/components/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";

interface HeaderProps {
  conversation:
    | (Conversation & { users: { user: User }[] })
    | (Conversation & { users: User[] });
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const normalizedUsers: User[] =
    "user" in conversation.users[0]
      ? (conversation.users as { user: User }[]).map((u) => u.user)
      : (conversation.users as User[]);

  const otherUser = useOtherUser({
    ...conversation,
    users: normalizedUsers,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.includes(otherUser?.email!);

  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${normalizedUsers.length} members`;
    return isActive ? "Active" : "Offline";
  }, [conversation.isGroup, normalizedUsers.length, isActive]);

  const avatarGroupUsers: (UserConversation & { user: User })[] = normalizedUsers.map(
    (u) => ({
      id: u.id, 
      userId: u.id,
      conversationId: conversation.id,
      user: u,
    })
  );

  // Scroll state for header animation
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ProfileDrawer
        data={{ ...conversation, users: normalizedUsers }}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Header Container */}
      <div className="relative w-full">
        {/* Gradient + Dynamic Blur Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-white/80 to-sky-50/50 backdrop-blur-sm rounded-b-xl pointer-events-none z-0 transition-all duration-300 ${
            scrolled ? "backdrop-blur-md" : "backdrop-blur-sm"
          }`}
        />

        {/* Header Content */}
        <div
          className={`relative flex border-b border-gray-200 sm:px-6 px-4 justify-between items-center shadow-md rounded-b-xl z-10 transition-all duration-300 ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          <div className="flex gap-3 items-center">
            {/* Back Button */}
            <Link
              href="/conversations"
              className="lg:hidden flex items-center justify-center p-2 rounded-full text-sky-500 hover:text-sky-600 hover:bg-sky-50 transition"
            >
              <HiChevronLeft size={28} />
            </Link>

            {/* Avatars */}
            {conversation.isGroup ? (
              <AvatarGroup
                users={avatarGroupUsers}
                size={40}
                overlap
                animate
              />
            ) : (
              <div className="relative">
                <Avatar
                  user={otherUser ?? undefined}
                  size={scrolled ? 40 : 48} // shrink on scroll
                />
                {/* {isActive && (
                  <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse transition-transform duration-300 hover:scale-125" />
                )} */}
              </div>
            )}

            {/* Conversation Info */}
            <div className="flex flex-col justify-center ml-2 overflow-hidden">
              <div
                className={`text-gray-900 font-semibold text-base truncate max-w-[200px] sm:max-w-xs transition-all duration-300 ${
                  scrolled ? "text-sm" : "text-base"
                }`}
              >
                {conversation.name || otherUser?.name}
              </div>
              <div
                className={`text-sm font-light text-gray-500 truncate max-w-[200px] sm:max-w-xs transition-all duration-300 ${
                  scrolled ? "text-xs" : "text-sm"
                }`}
              >
                {statusText}
              </div>
            </div>
          </div>

          {/* Options Button */}
          <HiEllipsisHorizontal
            size={28}
            onClick={() => setDrawerOpen(true)}
            className="text-sky-500 cursor-pointer hover:text-sky-600 hover:bg-sky-50 rounded-full p-1 transition"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
