import React from "react";
import type { Metadata } from "next";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";

export const metadata: Metadata = {
  title: "Conversations",
  description:
    "View and manage your conversations on Varta. Chat in real-time with friends, family, and colleagues.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://joinvarta.com/conversations",
  },
};

export default async function ConversationLayout({
    children
}: {
    children: React.ReactNode
}) {
    const conversations = await getConversations();
    const users = await getUsers();
    
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList
                    users={users}
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    )
}