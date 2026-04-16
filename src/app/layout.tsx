import type { Metadata } from "next";
import { Lexend, Space_Mono } from "next/font/google";

import { TopNav } from "@/components/layout/top-nav";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAIP Mission Control",
  description: "Single pane of glass for SSPs and SEs to execute faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#1a1a1a] text-neutral-200">
        <AuthProvider>
          <TopNav />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
