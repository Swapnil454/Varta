// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   //  swcPlugins: [
//   //   [
//   //     "next-superjson-plugin",
//   //     {}
//   //   ]
//   // ],
//   images: {
//     domains: [
//       "res.cloudinary.com",
//       "avatars.githubusercontent.com",
//       "lh3.googleusercontent.com"
//     ]
//   }
  
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",

  eslint: {
    // ✅ Do not block production builds on lint errors
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },

  // SEO and Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Security headers for better SEO and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
