import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import RootLayoutClient from "@/components/RootLayoutClient";

export const metadata: Metadata = {
  title: "AffiliateHub – Best Deals Online",
  description:
    "Discover the best products across electronics, fashion, home, beauty and books with exclusive affiliate deals.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden bg-gray-100 text-gray-900 min-h-screen">
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
              maxWidth: "360px",
              borderRadius: "10px",
            },
          }}
        />

        {/* 🔥 IMPORTANT: NO CONTAINER HERE */}
        {/* Header stays full width via RootLayoutClient */}
        <RootLayoutClient>
          {children}
        </RootLayoutClient>

      </body>
    </html>
  );
}