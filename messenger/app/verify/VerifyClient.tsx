
'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@/components/Button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface VerifyForm {
  code: string;
}

export default function VerifyClient() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params?.get("email") ?? "";

  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<VerifyForm>({
    defaultValues: { code: "" },
  });

  const codeValue = watch("code");

  // Container variants for staggered animation
  const containerVariants: Variants = {
    shakeFade: {
      transition: { staggerChildren: 0.05 },
    },
  };

  // Each input animation variant (TypeScript-safe)
  const inputVariants: Variants = {
  initial: { x: 0, scale: 1, opacity: 1 },
    animate: {
        x: [-12, 12, -8, 8, 0],      // directly array → keyframes
        scale: [1, 1.1, 0.95, 1],    // directly array → keyframes
        opacity: [0, 0.3, 0.6, 0.9, 1], // directly array → keyframes
        transition: {
          x: { type: "spring", stiffness: 300, damping: 15 },
          scale: { type: "spring", stiffness: 300, damping: 15 },
          opacity: { duration: 0.3 },
        },
    },
  };


  useEffect(() => {
    if (!email) {
      toast.error("Missing email");
      router.replace("/");
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit: SubmitHandler<VerifyForm> = async ({ code }) => {
    try {
      await axios.post("/api/auth/verify-otp", { email, code });
      toast.success("Email verified. You can sign in now.");
      router.replace("/");
    } catch (e: any) {
      toast.error(e?.response?.data || "Verification failed");

      // Trigger staggered shake/fade/bounce animation
      setShake(true);
      setTimeout(() => setShake(false), 500);

      // Clear inputs
      setValue("code", "");
      inputRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsSending(true);
    try {
      await axios.post("/api/auth/send-otp", { email });
      toast.success("New code sent");
      setCooldown(30);
    } catch (e: any) {
      toast.error(e?.response?.data || "Could not resend");
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    const digits = (codeValue || "").split("");
    digits[index] = value.slice(-1);
    setValue("code", digits.join(""));

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !codeValue?.[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-purple-300 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            <Image src="/images/Logoo.png" alt="Logo" width={48} height={48} className="mb-4" />
            <h2 className="text-center text-2xl font-bold text-gray-900">Verify your email</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We sent a 6-digit code to <span className="font-medium text-gray-800">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <motion.div
              variants={containerVariants}
              animate={shake ? "shakeFade" : "initial"}
              className="flex justify-between gap-2"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={codeValue?.[i] || ""}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="h-12 w-12 rounded-xl border border-gray-300 text-center text-lg font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                  variants={inputVariants}
                  initial="initial"
                  animate={shake ? "animate" : "initial"}
                />
              ))}
            </motion.div>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting || (codeValue?.length ?? 0) < 6}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 font-medium hover:opacity-90 transition"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              onClick={handleResend}
              disabled={isSending || cooldown > 0}
              className="text-indigo-600 underline disabled:opacity-50"
            >
              {isSending
                ? "Sending..."
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend code"}
            </button>
            <button
              onClick={() => router.replace("/")}
              className="text-gray-500 underline hover:text-gray-700"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
