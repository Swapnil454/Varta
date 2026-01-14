
'use client'

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 z-40 w-full flex items-center justify-between border-t bg-white lg:hidden overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 from-10% via-gray-50 via-70% to-indigo-100 to-90% animate-gradientMove bg-[length:200%_200%]" />

      {/* Content */}
      <div className="relative flex flex-1 justify-around items-center py-2">
        {routes.map((route) => (
          <MobileItem
            key={route.href}
            href={route.href}
            active={route.active}
            icon={route.icon}
            onClick={route.onClick}
          />
        ))}
      </div>

      {/* Gradient animation styles */}
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
    </div>
  );
};

export default MobileFooter;
