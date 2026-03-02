import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/forgot-password"],
        disallow: ["/users", "/conversations", "/api/", "/verify", "/reset-password"],
      },
    ],
    sitemap: "https://joinvarta.com/sitemap.xml",
  };
}
