import Link from "next/link";
import { ArrowUpRight, NotebookPen } from "lucide-react";
import { getNotes } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <main className="min-h-[calc(100svh-8.5rem)] flex-1 bg-[#faf9f6] px-6 py-14 text-[#25251f] sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 border-b border-[#e6e5dc] pb-8 sm:mb-14">
          <p className="mb-3 text-xs tracking-[0.24em] text-[#999a8e]">SMALL THOUGHTS, LONG READS</p>
          <h1 className="text-3xl font-medium tracking-wide text-[#34372b] sm:text-4xl">随笔</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#77786f] sm:text-base">
            收下日常的片段，也留出空间，慢慢写完一篇长文。
          </p>
          <p className="mt-5 text-xs tracking-wide text-[#999a8e]">{notes.length} 条记录</p>
        </header>

        {notes.length > 0 ? (
          <ol className="ml-1.5 border-l border-[#e3e2d8]">
            {notes.map((note) => (
              <li key={note.slug} className="relative pb-10 pl-6 last:pb-0 sm:pl-9">
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1.5 size-[9px] rounded-full border-2 border-[#a9ad91] bg-[#faf9f6]"
                />
                <Link href={`/notes/${note.slug}`} className="group block">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#999a8e]">
                    <time dateTime={note.date || undefined} className="tabular-nums tracking-wide">
                      {note.date || "未注明日期"}
                    </time>
                    <span aria-hidden="true" className="text-[#c7c7ba]">/</span>
                    <span className="font-medium text-[#777b63]">{note.theme}</span>
                  </div>
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h2 className="text-xl font-medium leading-snug text-[#34372b] transition-colors group-hover:text-[#69704f] sm:text-2xl">
                        {note.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-7 text-[#77786f] sm:text-[15px]">
                        {note.description || "打开记录，继续阅读。"}
                      </p>
                      {note.tags.length > 0 && (
                        <ul aria-label="标签" className="mt-4 flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <li key={tag} className="rounded-full bg-[#eeeee6] px-2.5 py-1 text-[11px] tracking-wide text-[#777b63]">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#a4a591] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#69704f]" />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8d8ca] bg-white/50 px-6 py-14 text-center">
            <NotebookPen aria-hidden="true" className="mx-auto size-5 text-[#999a8e]" />
            <p className="mt-4 text-sm text-[#55564e]">这里还没有随笔。</p>
            <p className="mt-2 text-xs leading-6 text-[#999a8e]">
              将 Markdown 文件放入 <code className="rounded bg-[#eeeee6] px-1.5 py-0.5">content/notes</code>，就会出现在这里。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
