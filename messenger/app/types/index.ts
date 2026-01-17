import { Conversation, Message, User, UserConversation, UserSeenMessage } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: (UserConversation & {
    user: User;
  })[];
  messages: FullMessageType[];
};
