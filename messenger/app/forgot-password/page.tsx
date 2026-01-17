
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>();
  const [sent, setSent] = useState(false);

  const onSubmit: SubmitHandler<ForgotForm> = async (data) => {
    try {
      await axios.post("/api/auth/forgot-password", { email: data.email });
      toast.success("Reset code sent to your email");
      setSent(true);
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (e: any) {
      toast.error(e?.response?.data || "Failed to send reset code");
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
              Enter your email and we’ll send you a reset code
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
