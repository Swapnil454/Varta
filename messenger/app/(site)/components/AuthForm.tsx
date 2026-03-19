'use client';

import axios from "axios";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

type FormData = {
  name?: string;
  email: string;
  password: string;
};

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialVariant = searchParams?.get('variant') === 'REGISTER' ? 'REGISTER' : 'LOGIN';
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  useEffect(() => {
    const urlVariant = searchParams?.get('variant');
    if (urlVariant === 'REGISTER' || urlVariant === 'LOGIN') {
      setVariant(urlVariant);
    }
  }, [searchParams]);

  const toggleVariant = useCallback(() => {
    setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN');
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password');

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
        .then(async () => {
          await axios.post('/api/auth/send-otp', { email: data.email });
          toast.success('Verification code sent to your email');
          router.push(`/verify?email=${encodeURIComponent(data.email)}`);
        })
        .catch((error) => {
          console.error('Registration error:', error);
          if (error.response?.status === 409) {
            toast.error('Email already exists. Please use a different email or try logging in.');
          } else if (error.response?.status === 400) {
            toast.error('Please fill in all required fields.');
          } else {
            toast.error('Registration failed. Please try again.');
          }
        })
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            if (callback.error.includes('not verified')) {
              toast.error('Please verify your email first');
              router.push(`/verify?email=${encodeURIComponent(data.email)}`);
            } else {
              toast.error('Invalid credentials');
            }
            return;
          }
          toast.success('Logged in!');
          router.push('/users');
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid Credentials');
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');
        }
      })
      .finally(() => setIsLoading(false));
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    const levels = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];

    return { strength, ...levels[Math.min(strength - 1, 3)] || { label: '', color: '' } };
  };

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <div className="mt-6">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Name field */}
        {variant === "REGISTER" && (
          <Input
            id="name"
            label="Name"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        )}

        {/* Email field */}
        <Input
          id="email"
          label="Email address"
          type="email"
          register={register}
          errors={errors}
          disabled={isLoading}
        />

        {/* Password field */}
        <div>
          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              register={register}
              errors={errors}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          {variant === 'REGISTER' && password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength.strength
                        ? passwordStrength.color
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.label && (
                <p className="text-xs text-gray-500 mt-1">
                  Password strength:{" "}
                  <span className={`font-medium ${
                    passwordStrength.strength >= 3 ? 'text-green-600' :
                    passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            variant === "LOGIN" ? "Sign In" : "Create Account"
          )}
        </button>
      </form>

      {/* Forgot password */}
      {variant === "LOGIN" && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-gray-500">or continue with</span>
        </div>
      </div>

      {/* Social login */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => socialAction("google")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <BsGoogle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>
        <button
          type="button"
          onClick={() => socialAction("github")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <BsGithub className="w-5 h-5 text-gray-800" />
          <span className="text-sm font-medium text-gray-700">GitHub</span>
        </button>
      </div>

      {/* Toggle link */}
      <div className="flex items-center justify-center gap-2 text-sm mt-6 text-gray-600">
        <span>
          {variant === "LOGIN" ? "New to Varta?" : "Already have an account?"}
        </span>
        <button
          type="button"
          onClick={toggleVariant}
          className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          disabled={isLoading}
        >
          {variant === "LOGIN" ? "Create an account" : "Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
