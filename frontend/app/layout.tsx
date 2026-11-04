import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "简乐",
  description: "大道至简，快乐至上",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf9f6]">
        <SiteHeader />
        {children}
        <footer className="h-14 shrink-0 border-t border-[#e9e8e0] bg-[#faf9f6]">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 text-xs text-[#88897e] sm:px-10 lg:px-16">
            <Link href="/" className="font-medium tracking-wide text-[#55564e]">
              简乐
            </Link>
            <span>大道至简，快乐至上</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
