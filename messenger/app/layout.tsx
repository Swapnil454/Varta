import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://joinvarta.com"),
  title: {
    default: "Varta - Real-time Chat & Messaging App | Connect Instantly",
    template: "%s | Varta",
  },
  description:
    "Varta is a modern real-time chat and messaging application. Connect with friends, family, and colleagues instantly with secure, fast, and reliable messaging. Start chatting today!",
  keywords: [
    "chat app",
    "messaging app",
    "real-time chat",
    "instant messaging",
    "Varta",
    "online chat",
    "secure messaging",
    "group chat",
    "video chat",
    "communication app",
    "free chat app",
    "messaging platform",
  ],
  authors: [{ name: "Varta Team", url: "https://joinvarta.com" }],
  creator: "Varta",
  publisher: "Varta",
  applicationName: "Varta",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/faviconn.png", sizes: "32x32", type: "image/png" },
      { url: "/faviconn.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/Logoo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/faviconn.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://joinvarta.com",
    siteName: "Varta",
    title: "Varta - Real-time Chat & Messaging App",
    description:
      "Connect instantly with Varta - the modern real-time chat application. Secure, fast, and reliable messaging for everyone.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varta - Real-time Chat Application",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varta - Real-time Chat & Messaging App",
    description:
      "Connect instantly with Varta - the modern real-time chat application. Secure, fast, and reliable messaging.",
    images: ["/images/og-image.png"],
    creator: "@vartaapp",
    site: "@vartaapp",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://joinvarta.com",
  },
  category: "technology",
  classification: "Communication",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Varta",
    "msapplication-TileColor": "#7c3aed",
    "msapplication-config": "/browserconfig.xml",
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Varta",
  alternateName: "Varta Chat",
  url: "https://joinvarta.com",
  description:
    "Varta is a modern real-time chat and messaging application. Connect with friends, family, and colleagues instantly.",
  applicationCategory: "CommunicationApplication",
  operatingSystem: "Web Browser",
  browserRequirements: "Requires JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Real-time messaging",
    "Group chats",
    "File sharing",
    "Image sharing",
    "User presence status",
    "Secure authentication",
  ],
  screenshot: "https://joinvarta.com/images/og-image.png",
  author: {
    "@type": "Organization",
    name: "Varta",
    url: "https://joinvarta.com",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Varta",
  url: "https://joinvarta.com",
  logo: "https://joinvarta.com/images/Logoo.png",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
