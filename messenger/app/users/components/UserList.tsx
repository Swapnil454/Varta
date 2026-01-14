
'use client'

import { User } from "@/app/generated/prisma";
import React, { useState } from "react";
import UserBox from "./UserBox";
import { HiOutlineDotsVertical } from "react-icons/hi";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import { Menu } from "@headlessui/react";
import { signOut } from "next-auth/react";

interface UserListProps {
  items: User[];
  currentUser: User;
}

const UserList: React.FC<UserListProps> = ({ items, currentUser }) => {
  const [search, setSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const filteredUsers = items.filter((item) =>
    (item.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className="
        fixed inset-y-0
        lg:left-20 lg:w-80 w-full
        border-r border-gray-200
        flex flex-col
        bg-gradient-to-b from-blue-50 via-gray-50 to-blue-50
        shadow-sm
      "
    >
      {/* Settings Modal */}
      <SettingsModal
        currentUser={currentUser}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-neutral-800">People</h2>

          {/* Dropdown - only visible below lg */}
          <div className="lg:hidden">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button
                className="flex items-center justify-center rounded-full p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                <HiOutlineDotsVertical size={20} />
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {/* Settings */}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        Settings
                      </button>
                    )}
                  </Menu.Item>

                  {/* Logout */}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
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

      {/* Scrollable User List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
        {filteredUsers.map((item) => (
          <div
            key={item.id}
            className="rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <UserBox data={item} />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default UserList;
