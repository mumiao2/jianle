import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
        <header className="relative z-10 flex h-20 w-full items-center justify-between px-6 sm:px-10 lg:px-16">
          <Link href="/" aria-label="简乐首页" className="flex h-full items-center">
            <Image
              src="/jianle-logo.png"
              alt="简乐，大道至简，快乐至上"
              width={120}
              height={88}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <nav aria-label="主导航" className="flex items-center gap-5 sm:gap-8">
            {[
              { label: "首页", href: "/" },
              { label: "博客", href: "/blog" },
              { label: "随笔", href: "/notes" },
              { label: "实验室", href: "/lab" },
              { label: "关于", href: "/about" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[#68695f] transition-colors hover:text-[#25251f] sm:text-[15px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
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
