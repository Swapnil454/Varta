import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { User, Conversation } from "@prisma/client";

type ConversationWithUsers = Conversation & { users: User[] };

const useOtherUser = (conversation: ConversationWithUsers) => {
  const { data: session } = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.user?.email;
    return (
      conversation.users.find((u) => u.email !== currentUserEmail) || null
    );
  }, [conversation.users, session?.user?.email]);

  return otherUser;
};

export default useOtherUser;
