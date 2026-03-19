import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "../(site)/components/AuthForm";
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
    url: "https://joinvarta.com/auth",
    type: "website",
  },
  twitter: {
    title: "Login or Sign Up | Varta",
    description:
      "Join Varta today! Login or create an account to start messaging instantly.",
  },
  alternates: {
    canonical: "https://joinvarta.com/auth",
  },
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                alt="Varta"
                width={36}
                height={36}
                src="/images/Logoo.png"
              />
              <span className="text-xl font-semibold text-gray-900">Varta</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md py-12">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  alt="Varta Logo"
                  width={48}
                  height={48}
                  src="/images/Logoo.png"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to Varta
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to start chatting with friends
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              }
            >
              <AuthForm />
            </Suspense>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-indigo-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-indigo-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Fast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
