import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { ReadingProgress } from "@/components/reading-progress";
import { getAdjacentNotes, getNote } from "@/lib/posts";
import { renderNoteMarkdown } from "@/lib/notes-markdown";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) return { title: "随笔未找到 | 简乐" };

  return {
    title: `${note.title} | 简乐`,
    description: note.description,
  };
}

function Contents({
  headings,
  className,
}: {
  headings: Awaited<ReturnType<typeof renderNoteMarkdown>>["headings"];
  className?: string;
}) {
  return (
    <nav aria-label="文章目录" className={className}>
      <p className="mb-4 text-xs font-medium tracking-[0.18em] text-[#999a8e]">目录</p>
      <ol className="space-y-3 border-l border-[#e3e2d8]">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth > 2 ? "pl-5" : "pl-3"}>
            <Link
              href={`#${heading.id}`}
              className="text-sm leading-6 text-[#77786f] transition-colors hover:text-[#34372b]"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();

  const [{ html, headings }, { previous, next }] = await Promise.all([
    renderNoteMarkdown(note.content.replace(/^#\s+.+\r?\n?/, "").trim()),
    getAdjacentNotes(slug),
  ]);

  return (
    <>
      <ReadingProgress />
      <main className="min-h-[calc(100svh-8.5rem)] flex-1 bg-[#faf9f6] px-6 py-12 text-[#25251f] sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-sm text-[#77786f] transition-colors hover:text-[#34372b]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            返回随笔
          </Link>

          <header className="mb-9 mt-9 max-w-3xl border-b border-[#e6e5dc] pb-8 sm:mb-12 sm:mt-12">
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#777b63]">{note.theme}</p>
            <h1 className="text-3xl font-medium leading-tight tracking-wide text-[#34372b] sm:text-4xl md:text-5xl">
              {note.title}
            </h1>
            {note.date && (
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-[#999a8e]">
                <CalendarDays aria-hidden="true" className="size-4" />
                <time dateTime={note.date}>{note.date}</time>
              </p>
            )}
            {note.tags.length > 0 && (
              <ul aria-label="标签" className="mt-5 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-[#eeeee6] px-2.5 py-1 text-[11px] tracking-wide text-[#777b63]">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          {headings.length > 0 && (
            <details className="mb-8 rounded-xl border border-[#e6e5dc] bg-white/60 p-5 lg:hidden">
              <summary className="cursor-pointer text-sm font-medium text-[#55564e]">文章目录</summary>
              <Contents headings={headings} className="mt-5" />
            </details>
          )}

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            <article
              className="max-w-3xl text-[15px] leading-8 text-[#55564e] sm:text-base [&_a]:text-[#69704f] [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-[#34372b] [&_blockquote]:border-l-2 [&_blockquote]:border-[#c9cbb8] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[#77786f] [&_code]:rounded [&_code]:bg-[#f0efe9] [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:text-[#34372b] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[#34372b] [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-[#34372b] [&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-6 [&_pre]:my-7 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#292b24] [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-7 [&_pre]:text-[#f3f2eb] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <Contents headings={headings} className="sticky top-8" />
              </aside>
            )}
          </div>

          {(previous || next) && (
            <nav aria-label="前后随笔" className="mt-16 grid gap-4 border-t border-[#e6e5dc] pt-8 sm:grid-cols-2">
              {previous ? (
                <Link href={`/notes/${previous.slug}`} className="group rounded-xl border border-[#e6e5dc] bg-white/60 p-5 transition-colors hover:border-[#c9cbb8]">
                  <span className="flex items-center gap-2 text-xs text-[#999a8e]">
                    <ArrowLeft aria-hidden="true" className="size-3.5" />
                    上一条 · 更早
                  </span>
                  <span className="mt-3 block font-medium text-[#55564e] group-hover:text-[#69704f]">{previous.title}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={`/notes/${next.slug}`} className="group rounded-xl border border-[#e6e5dc] bg-white/60 p-5 text-left transition-colors hover:border-[#c9cbb8] sm:text-right">
                  <span className="flex items-center justify-end gap-2 text-xs text-[#999a8e]">
                    下一条 · 更新
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="mt-3 block font-medium text-[#55564e] group-hover:text-[#69704f]">{next.title}</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
    </>
  );
}
