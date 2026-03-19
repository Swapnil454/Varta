import type { Metadata } from "next";
import LandingPage from "./components/LandingPage";

export const metadata: Metadata = {
  title: "Varta - Real-time Chat & Messaging App | Connect Instantly",
  description:
    "Varta is a modern real-time chat and messaging application. Connect with friends, family, and colleagues instantly with secure, fast, and reliable messaging. Start chatting today!",
  keywords: [
    "chat app",
    "messaging app",
    "real-time chat",
    "instant messaging",
    "Varta",
    "online chat",
    "secure messaging",
    "group chat",
    "communication app",
    "free chat app",
  ],
  openGraph: {
    title: "Varta - Real-time Chat & Messaging App",
    description:
      "Connect instantly with Varta - the modern real-time chat application. Secure, fast, and reliable messaging for everyone.",
    url: "https://joinvarta.com",
    type: "website",
  },
  twitter: {
    title: "Varta - Real-time Chat & Messaging App",
    description:
      "Connect instantly with Varta - the modern real-time chat application. Secure, fast, and reliable messaging.",
  },
  alternates: {
    canonical: "https://joinvarta.com",
  },
};

export default function Home() {
  return <LandingPage />;
}
