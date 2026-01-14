
'use client'

import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) return onClick();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="relative group flex-1 flex justify-center"
    >
      <div
        className={clsx(
          `
          relative flex items-center justify-center
          rounded-2xl p-3
          text-gray-500
          transition-all duration-300
          hover:scale-110
          hover:text-gray-900
          focus:outline-none
        `,
          active
            ? "bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white shadow-md"
            : "bg-white/40 backdrop-blur-md hover:bg-white/70"
        )}
      >
        {/* Glow background */}
        <span
          className={clsx(
            `
            absolute inset-0 rounded-2xl
            opacity-0 group-hover:opacity-100
            transition duration-500 blur-xl
          `,
            active
              ? "bg-gradient-to-r from-blue-400/60 to-indigo-400/60"
              : "bg-blue-300/20"
          )}
        />

        {/* Icon */}
        <Icon className="relative h-6 w-6 z-10" />
      </div>
    </Link>
  );
};

export default MobileItem;
