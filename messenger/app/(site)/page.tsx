
import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-purple-300 px-4"
    >
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-6">
          <div className="flex flex-col items-center">
            <Image
              alt="Logo"
              width={40}   
              height={40}
              className="mb-2"
              src="/images/Logoo.png"
            />
            <h2 className="text-center text-xl font-bold text-gray-900">
              Log in or sign up
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              Get smarter responses and upload files, images, and more.
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
