import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100svh-8.5rem)] flex-1 items-center justify-center overflow-hidden bg-[#faf9f6] px-6 text-[#25251f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[min(78vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,231,211,0.62)_0%,rgba(250,249,246,0)_68%)]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 256 256"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[min(74vw,540px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.12] motion-safe:animate-[spin_36s_linear_infinite] motion-reduce:animate-none"
      >
        <circle cx="128" cy="128" r="120" fill="#e8e8db" />
        <path
          d="M128 8a120 120 0 0 1 0 240 60 60 0 0 1 0-120 60 60 0 0 0 0-120Z"
          fill="#555b45"
        />
        <circle cx="128" cy="68" r="13" fill="#e8e8db" />
        <circle cx="128" cy="188" r="13" fill="#555b45" />
        <circle cx="128" cy="128" r="120" fill="none" stroke="#555b45" strokeWidth="2" />
      </svg>

      <section className="relative flex -translate-y-3 flex-col items-center text-center">
        <h1 className="text-5xl font-medium tracking-[0.18em] sm:text-6xl md:text-7xl">
          简乐
        </h1>
        <p className="mt-6 text-lg tracking-[0.22em] text-[#77786f] sm:text-xl md:text-2xl">
          简单的快乐
        </p>
        <Button
          render={<Link href="/blog" />}
          nativeButton={false}
          className="mt-12 h-12 rounded-full bg-[#34372b] px-7 text-sm tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(52,55,43,0.12)] hover:bg-[#4a4d3d]"
        >
          一切从简
          <ArrowUpRight aria-hidden="true" className="ml-1 size-4" />
        </Button>
      </section>
    </main>
  );
}
