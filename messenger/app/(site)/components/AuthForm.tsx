
'use client';

import axios from "axios";

import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

type FormData = {
  name?: string;
  email: string;
  password: string;
};

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
        .then(async () => {
          // Kick off OTP
          await axios.post('/api/auth/send-otp', { email: data.email });
          toast.success('Verification code sent to your email');
          // Go to verify page
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

  // return (
  //   <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
  //     <div className="bg-white px-4 py-9 shadow sm:rounded-lg sm:px-10">
  //       <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
  //         {variant === 'REGISTER' && (
  //           <Input
  //             id="name"
  //             label="Name"
  //             register={register}
  //             errors={errors}
  //             disabled={isLoading}
  //           />
  //         )}
  //         <Input
  //           id="email"
  //           label="Email address"
  //           type="email"
  //           register={register}
  //           errors={errors}
  //           disabled={isLoading}
  //         />
  //         <Input
  //           id="password"
  //           label="Password"
  //           type="password"
  //           register={register}
  //           errors={errors}
  //           disabled={isLoading}
  //         />
  //         <div>
  //           <Button disabled={isLoading} fullWidth type="submit">
  //             {variant === 'LOGIN' ? 'Sign in' : 'Register'}
  //           </Button>
  //         </div>
  //       </form>

  //       {/* ✅ Forgot password link only for LOGIN */}
  //       {variant === 'LOGIN' && (
  //         <div className="mt-4 text-center">
  //           <button
  //             type="button"
  //             onClick={() => router.push('/forgot-password')}
  //             className="text-sm text-sky-600 hover:underline"
  //             disabled={isLoading}
  //           >
  //             Forgot password?
  //           </button>
  //         </div>
  //       )}

  //       <div className="mt-6">
  //         <div className="relative">
  //           <div className="absolute inset-0 flex items-center">
  //             <div className="w-full border-t border-gray-300" />
  //           </div>
  //           <div className="relative flex justify-center text-sm">
  //             <span className="bg-white px-2 text-gray-500">Or continue with</span>
  //           </div>
  //         </div>

  //         <div className="mt-6 flex gap-2">
  //           <AuthSocialButton
  //             icon={BsGithub}
  //             onClick={() => socialAction('github')}
  //           />
  //           <AuthSocialButton
  //             icon={BsGoogle}
  //             onClick={() => socialAction('google')}
  //           />
  //         </div>
  //       </div>

  //       <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
  //         <div>
  //           {variant === 'LOGIN'
  //             ? 'New to Messenger?'
  //             : 'Already have an account'}
  //         </div>
  //         <div
  //           onClick={toggleVariant}
  //           className="underline cursor-pointer"
  //         >
  //           {variant === 'LOGIN' ? 'Create an account' : 'Login'}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
  <div className="mt-4">
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      {variant === "REGISTER" && (
        <Input
          id="name"
          label="Name"
          register={register}
          errors={errors}
          disabled={isLoading}
        />
      )}
      <Input
        id="email"
        label="Email address"
        type="email"
        register={register}
        errors={errors}
        disabled={isLoading}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        register={register}
        errors={errors}
        disabled={isLoading}
      />
      <Button
        disabled={isLoading}
        fullWidth
        type="submit"
        className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 font-medium hover:opacity-90"
      >
        {variant === "LOGIN" ? "Continue" : "Register"}
      </Button>
    </form>

    {/* Forgot password */}
    {variant === "LOGIN" && (
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-sm text-sky-600 hover:underline"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
    )}

    {/* Divider */}
    <div className="mt-4 relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white/80 backdrop-blur-md px-2 text-gray-500">
          OR
        </span>
      </div>
    </div>

    {/* Social login */}
    <div className="mt-4 space-y-2">
      <AuthSocialButton
        icon={BsGoogle}
        label="Continue with Google"
        onClick={() => socialAction("google")}
      />
      <AuthSocialButton
        icon={BsGithub}
        label="Continue with GitHub"
        onClick={() => socialAction("github")}
      />
    </div>

    {/* Toggle link */}
    <div className="flex gap-2 justify-center text-sm mt-4 px-2 text-gray-500">
      <div>
        {variant === "LOGIN" ? "New here?" : "Already have an account?"}
      </div>
      <div
        onClick={toggleVariant}
        className="underline cursor-pointer font-medium text-indigo-600"
      >
        {variant === "LOGIN" ? "Create an account" : "Login"}
      </div>
    </div>
  </div>
);
};

export default AuthForm;
