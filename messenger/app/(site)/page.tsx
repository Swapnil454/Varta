
import Image from "next/image";
import AuthForm from "./components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login or Sign Up",
  description:
    "Login or create a new account on Varta. Start chatting with friends, family, and colleagues in real-time. Secure and fast messaging platform.",
  keywords: [
    "login",
    "sign up",
    "register",
    "varta login",
    "chat login",
    "create account",
  ],
  openGraph: {
    title: "Login or Sign Up | Varta",
    description:
      "Join Varta today! Login or create an account to start messaging instantly.",
    url: "https://joinvarta.com",
    type: "website",
  },
  twitter: {
    title: "Login or Sign Up | Varta",
    description:
      "Join Varta today! Login or create an account to start messaging instantly.",
  },
  alternates: {
    canonical: "https://joinvarta.com",
  },
};

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-purple-300 px-4"
    >
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-6">
          <div className="flex flex-col items-center">
            <Image
              alt="Logo"
              width={40}   
              height={40}
              className="mb-2"
              src="/images/Logoo.png"
            />
            <h2 className="text-center text-xl font-bold text-gray-900">
              Log in or sign up
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              Get smarter responses and upload files, images, and more.
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
