import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Forgot your Varta password? Enter your email to receive a password reset code and regain access to your account.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Forgot Password | Varta",
    description:
      "Reset your Varta account password securely. We'll send you a code to verify your identity.",
    url: "https://joinvarta.com/forgot-password",
  },
  alternates: {
    canonical: "https://joinvarta.com/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
