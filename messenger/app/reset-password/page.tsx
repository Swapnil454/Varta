

import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your Varta account password securely. Enter your new password to regain access to your chat account.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://joinvarta.com/reset-password",
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient  />
    </Suspense>
  );
}
