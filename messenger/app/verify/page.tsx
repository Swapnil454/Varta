import { Suspense } from "react";
import VerifyClient from "./VerifyClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to complete your Varta account registration. Secure account verification process.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://joinvarta.com/verify",
  },
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Verifying…</div>}>
      <VerifyClient />
    </Suspense>
  );
}
