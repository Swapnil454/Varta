'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import { useForm, SubmitHandler } from "react-hook-form";

interface ForgotForm {
  email: string;
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
      const retryAfter = data?.retryAfter || 300;
      const minutes = Math.ceil(retryAfter / 60);
      return `Too many attempts. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`;
    case 503:
      return "Email service is temporarily unavailable. Please try again in a few minutes.";
    case 500:
      return "Something went wrong. Please try again later.";
    default:
      return "Failed to send reset code. Please try again.";
  }
}

export default function ForgotPasswordClient() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>();
  const [sent, setSent] = useState(false);

  const onSubmit: SubmitHandler<ForgotForm> = async (data) => {
    try {
      await axios.post("/api/auth/forgot-password", { email: data.email });
      toast.success("If an account exists with this email, a reset code has been sent.");
      setSent(true);
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (e: any) {
      const message = getErrorMessage(e);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-purple-300 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Forgot Password
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you a reset code
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input<ForgotForm>
              id="email"
              label="Email"
              type="email"
              register={register}
              errors={errors}
              required
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 font-medium hover:opacity-90"
            >
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm text-indigo-600 hover:underline"
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
