"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "首页", href: "/" },
  { label: "博客", href: "/blog" },
  { label: "随笔", href: "/notes" },
  { label: "实验室", href: "/lab" },
  { label: "关于", href: "/about" },
];

function isCurrentPage(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const linkClass = (href: string) => {
    const current = pathname ? isCurrentPage(pathname, href) : false;
    return `relative py-2 text-sm transition-colors focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#879174] focus-visible:ring-offset-4 ${
      current
        ? "font-medium text-[#34372b] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[#777b63]"
        : "text-[#68695f] hover:text-[#25251f]"
    }`;
  };

  return (
    <header className="relative z-40 flex h-20 w-full items-center justify-between bg-[#faf9f6] px-5 sm:px-10 lg:px-16">
      <Link href="/" aria-label="简乐首页" className="flex h-full shrink-0 items-center">
        <Image
          src="/jianle-mark.png"
          alt="简乐标志"
          width={120}
          height={88}
          priority
          className="h-14 w-auto object-contain"
        />
      </Link>

      <nav aria-label="主导航" className="hidden items-center gap-8 sm:flex">
        {navigation.map((item) => {
          const current = pathname ? isCurrentPage(pathname, item.href) : false;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative sm:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
          aria-controls="mobile-primary-navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-11 items-center justify-center rounded-full text-[#4c4e43] transition-colors hover:bg-[#efeee8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#879174]"
        >
          {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
        <nav
          id="mobile-primary-navigation"
          aria-label="主导航"
          hidden={!mobileOpen}
          className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-[#e6e5dc] bg-[#faf9f6] p-2 shadow-[0_16px_40px_rgba(52,55,43,0.12)]"
        >
          {navigation.map((item) => {
            const current = pathname ? isCurrentPage(pathname, item.href) : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#879174] ${
                  current
                    ? "bg-[#eeeee6] font-medium text-[#34372b]"
                    : "text-[#68695f] hover:bg-[#f1f0ea] hover:text-[#25251f]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
