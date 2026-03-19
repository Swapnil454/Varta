
'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ResetForm {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// Helper to get user-friendly error message
function getErrorMessage(error: any): string {
  const data = error?.response?.data;
  const status = error?.response?.status;

  // Handle structured error responses
  if (typeof data === "object" && data?.error) {
    return data.error;
  }

  // Handle string error responses
  if (typeof data === "string" && data.length > 0) {
    return data;
  }

  // Handle common HTTP status codes
  switch (status) {
    case 429:
      return "Too many attempts. Please wait before trying again.";
    case 410:
      return "Code has expired. Please request a new one.";
    case 401:
      return "Invalid code. Please check and try again.";
    case 503:
      return "Service temporarily unavailable. Please try again in a few minutes.";
    default:
      return "Reset failed. Please try again.";
  }
}

export default function ResetPasswordClient () {
  const params = useSearchParams();
  const router = useRouter();
  const email = params?.get("email") ?? "";

  const [shake, setShake] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  const codeValue = watch("code");
  const passwordValue = watch("newPassword");

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

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsSending(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      toast.success("New code sent to your email");
      setCooldown(30);
    } catch (e: any) {
      const message = getErrorMessage(e);
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit: SubmitHandler<ResetForm> = async (data) => {
    try {
      await axios.post("/api/auth/reset-password", {
        email,
        code: data.code,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully");
      router.push("/");
    } catch (e: any) {
      const message = getErrorMessage(e);
      toast.error(message);

      // Only shake and clear code for invalid code errors
      const status = e?.response?.status;
      if (status === 401 || status === 410 || status === 429) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setValue("code", "");
        inputRefs.current.forEach((input) => { if (input) input.value = ""; });
        inputRefs.current[0]?.focus();
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-purple-300 px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-md">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col items-center">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-6">
              Enter the 6-digit code sent to <span className="font-medium text-gray-800 break-words">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Inputs */}
            <motion.div
              animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex justify-between gap-2 sm:gap-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={codeValue?.[i] || ""}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl border border-gray-300 text-center text-lg sm:text-xl font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                />
              ))}
            </motion.div>

            {/* Resend OTP button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResend}
                disabled={isSending || cooldown > 0}
                className="text-sm sm:text-base text-indigo-600 underline disabled:opacity-50"
              >
                {isSending
                  ? "Sending..."
                  : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend code"}
              </button>
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <Input<ResetForm>
                id="newPassword"
                label="New Password"
                type="password"
                register={register}
                errors={errors}
                required
                disabled={isSubmitting}
              />
              <PasswordStrengthIndicator password={passwordValue || ""} />
            </div>

            <Input<ResetForm>
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              register={register}
              errors={errors}
              required
              disabled={isSubmitting}
              validate={(value: string) =>
                value === watch("newPassword") || "Passwords must match"
              }
            />

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting || (codeValue?.length ?? 0) < 6}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 sm:py-3.5 font-medium hover:opacity-90 transition"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm sm:text-base text-indigo-600 hover:underline"
              disabled={isSubmitting}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}