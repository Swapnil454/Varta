

import type { Metadata } from "next";
import getUsers from "../actions/getUsers";
import getCurrentUser from "../actions/getCurrentUser";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export const metadata: Metadata = {
  title: "Users",
  description:
    "Browse and connect with other users on Varta. Start new conversations and build your network.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://joinvarta.com/users",
  },
};

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} currentUser={currentUser!} />
        {children}
      </div>
    </Sidebar>
  );
}

