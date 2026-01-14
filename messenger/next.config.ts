import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //  swcPlugins: [
  //   [
  //     "next-superjson-plugin",
  //     {}
  //   ]
  // ],
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com"
    ]
  }
  
};

export default nextConfig;
