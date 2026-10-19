import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText } from "lucide-react";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-[calc(100svh-8.5rem)] flex-1 bg-[#faf9f6] px-6 py-16 text-[#25251f] sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs tracking-[0.24em] text-[#999a8e]">SUMMARY &amp; LESSON</p>
            <h1 className="text-3xl font-medium tracking-wide sm:text-4xl">博客</h1>
            <p className="mt-3 text-sm text-[#77786f]">记住来时路，也分享经验。</p>
          </div>
          <span className="hidden items-center gap-2 pb-1 text-sm text-[#999a8e] sm:flex">
            <FileText aria-hidden="true" className="size-4" />
            {posts.length} 篇文章
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex min-h-56 flex-col rounded-2xl border border-[#e9e8e0] bg-white/80 p-6 transition-all hover:-translate-y-1 hover:border-[#d8d8ca] hover:shadow-[0_14px_36px_rgba(52,55,43,0.07)]"
              >
                {post.date && (
                  <span className="mb-5 inline-flex items-center gap-2 text-xs text-[#999a8e]">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    {post.date}
                  </span>
                )}
                <h2 className="text-xl font-medium leading-snug text-[#34372b]">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[#77786f]">
                  {post.description || "打开文章，继续阅读。"}
                </p>
                <span className="mt-5 flex items-center gap-1 text-sm text-[#777b63] transition-colors group-hover:text-[#34372b]">
                  阅读文章
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8d8ca] bg-white/50 px-6 py-16 text-center text-sm text-[#77786f]">
            还没有发布文章。
          </div>
        )}
      </div>
    </main>
  );
}
