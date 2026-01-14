// 'use client'

// import clsx from "clsx";
// import Link from "next/link";

// interface DesktopItemProps {
//   href: string;
//   label: string;   // 
//   icon: any;
//   active?: boolean;
//   onClick?: () => void;
// }

// const DesktopItem: React.FC<DesktopItemProps> = ({
//   href,
//   label,
//   icon: Icon,
//   active,
//   onClick
// }) => {
//   const handleClick = () => {
//     if (onClick) {
//       return onClick();
//     }
//   };
//   return (
//     <li onClick={handleClick}>
//       <Link 
//         href={href}
//         className={clsx(`
//             group
//             flex
//             gap-x-3
//             rounded-md
//             p-3
//             text-sm
//             leading-6
//             font-semibold
//             text-gray-500
//             hover:text-black
//             hover:bg-gray-100
//           `,
//           active && 'bg-gray-100 text-black'
//         )}
//       >
//       <Icon className=" h-6 w-6 shrink-0" />
//         <span className="sr-only">{label}</span>
//       </Link>
//     </li>
//   )
// }

// export default DesktopItem;

'use client'

import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) return onClick();
  };

  return (
    <li onClick={handleClick} className="relative group">
      <Link
        href={href}
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

        {/* Label for screen readers */}
        <span className="sr-only">{label}</span>
      </Link>

      
    </li>
  );
};

export default DesktopItem;
