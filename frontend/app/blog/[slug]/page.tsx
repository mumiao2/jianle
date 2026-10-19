import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { getPost } from "@/lib/posts";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "文章未找到 | 简乐" };

  return {
    title: `${post.title} | 简乐`,
    description: post.description,
  };
}

async function MarkdownBody({ content }: { content: string }) {
  const rendered = await remark().use(remarkHtml).process(content);

  return (
    <div
      className="space-y-6 text-[15px] leading-8 text-[#55564e] sm:text-base [&_a]:text-[#69704f] [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-[#34372b] [&_blockquote]:border-l-2 [&_blockquote]:border-[#c9cbb8] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[#77786f] [&_code]:rounded [&_code]:bg-[#f0efe9] [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:pt-3 [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:text-[#34372b] [&_h2]:pt-3 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[#34372b] [&_h3]:pt-2 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-[#34372b] [&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#292b24] [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-7 [&_pre]:text-[#f3f2eb] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: rendered.toString() }}
    />
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const articleBody = post.content.replace(/^#\s+.+\r?\n?/, "").trim();

  return (
    <main className="min-h-[calc(100svh-8.5rem)] flex-1 bg-[#faf9f6] px-6 py-14 text-[#25251f] sm:px-10 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="mb-10 inline-flex items-center gap-2 text-sm text-[#77786f] transition-colors hover:text-[#34372b]">
          <ArrowLeft aria-hidden="true" className="size-4" />
          返回博客
        </Link>

        <header className="mb-10 border-b border-[#e6e5dc] pb-8">
          <h1 className="text-3xl font-medium leading-tight tracking-wide text-[#34372b] sm:text-4xl">
            {post.title}
          </h1>
          {post.date && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-[#999a8e]">
              <CalendarDays aria-hidden="true" className="size-4" />
              {post.date}
            </p>
          )}
        </header>

        <MarkdownBody content={articleBody} />
      </article>
    </main>
  );
}
