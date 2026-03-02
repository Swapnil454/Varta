
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EmptyState = () => {
  return (
    <div className="h-full flex flex-col justify-between items-center relative overflow-hidden transition-colors duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 from-10% via-gray-50 via-70% to-indigo-100 to-90% animate-gradientMove bg-[length:200%_200%]" />

      {/* Center Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center flex-1 z-10"
      >
        {/* Floating + Animated Circular Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center"
        >
          {/* Animated outer ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-32 h-32 rounded-full border-2 border-blue-300/40"
          />

          {/* Static subtle ring */}
          <div className="absolute w-28 h-28 rounded-full border border-gray-300" />

          {/* Circle logo */}
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <Image
              alt="Messenger Logo"
              width={96}
              height={96}
              src="/images/Logoo.png"
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
        </motion.div>

        {/* Title with shimmer */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="mt-6 text-3xl font-bold text-gray-900 text-center relative overflow-hidden"
        >
          Varta for Windows
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent shimmer" />
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="mt-2 text-base text-gray-600 text-center max-w-md"
        >
          Send and receive messages without keeping your phone online.
        </motion.p>

        {/* Typing indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex gap-1 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-blue-400"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="pb-6 z-10"
      >
        <p className="text-xs text-gray-500 flex items-center gap-1 justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M6 10.5h12v9H6v-9z"
            />
          </svg>
          End-to-end encrypted
        </p>
      </motion.div>

      {/* Extra Tailwind Keyframes */}
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

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer {
          animation: shimmer 3s infinite;
          background-size: 200% 100%;
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
};

export default EmptyState;
