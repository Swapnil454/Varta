
'use client'

import { useState } from "react";
import useRoutes from "@/app/hooks/useRoutes";
import DesktopItem from "./DesktopItem";
import { User } from "@/app/generated/prisma";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Hide on mobile, show only on lg and above */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:flex lg:flex-col lg:justify-between lg:border-r lg:overflow-hidden">
        {/* Background gradient like EmptyState */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 from-10% via-gray-50 via-70% to-indigo-100 to-90% animate-gradientMove bg-[length:200%_200%]" />

        {/* Content */}
        <div className="relative flex flex-col justify-between flex-1">
          {/* Navigation */}
          <ul className="flex flex-col items-center gap-2 mt-4">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>

          {/* User Avatar */}
          <button
            onClick={() => setIsOpen(true)}
            className="mb-4 flex justify-center hover:opacity-80 transition"
          >
            <Avatar user={currentUser} />
          </button>
        </div>

        {/* Same gradient animation styles */}
        <style jsx>{`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradientMove {
            animation: gradientMove 12s ease infinite;
          }
        `}</style>
      </aside>
    </>
  );
};

export default DesktopSidebar;
