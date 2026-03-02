
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
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-purple-300 px-4 py-8"
    >
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-6">
          <div className="flex flex-col items-center">
            <Image
              alt="Varta - Real-time Chat Application Logo"
              width={40}   
              height={40}
              className="mb-2"
              src="/images/Logoo.png"
            />
            <h1 className="text-center text-xl font-bold text-gray-900">
              Welcome to Varta
            </h1>
            <p className="mt-1 text-center text-sm text-gray-600">
              Secure real-time messaging for everyone
            </p>
          </div>

          <AuthForm />

          {/* Trust indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & encrypted connection</span>
            </div>
            <p className="text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-600">
        <p className="mb-2">
          © {new Date().getFullYear()} Varta. All rights reserved.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
