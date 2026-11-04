type LabProject = {
  name: string;
  description: string;
  category: string;
  status: "可体验" | "开发中";
  href?: string;
};

const projects: LabProject[] = [];

export default function LabPage() {
  return (
    <main className="min-h-[calc(100svh-8.5rem)] flex-1 bg-[#faf9f6] px-6 py-14 text-[#25251f] sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6 border-b border-[#e8e7df] pb-8 sm:pb-10">
          <div>
            <p className="mb-4 text-[11px] tracking-[0.24em] text-[#929287]">JIANLE · LAB</p>
            <h1 className="text-3xl font-medium tracking-[0.08em] sm:text-4xl">实验室</h1>
            <p className="mt-4 text-sm leading-7 tracking-wide text-[#77786f] sm:text-base">
              把灵感做成可以使用的小东西。
            </p>
          </div>
          <p className="shrink-0 pb-1 text-xs tracking-wide text-[#929287]">
            <span className="mr-2 font-mono text-[#596b55]">{String(projects.length).padStart(2, "0")}</span>
            个作品
          </p>
        </div>

        {projects.length > 0 ? (
          <section aria-label="实验室作品" className="grid gap-5 py-9 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.name}
                className="group flex min-h-64 flex-col rounded-2xl border border-[#e8e9df] bg-white/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cbd7c5] hover:shadow-[0_18px_45px_rgba(58,76,54,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#edf3e9] text-lg text-[#62775e]">
                    {project.name.slice(0, 1)}
                  </div>
                  <span className="rounded-full bg-[#f1f4ed] px-3 py-1 text-[11px] tracking-wide text-[#697c64]">
                    {project.status}
                  </span>
                </div>
                <p className="mt-6 text-[11px] tracking-[0.16em] text-[#929287]">{project.category}</p>
                <h2 className="mt-2 text-lg font-medium tracking-wide">{project.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#77786f]">{project.description}</p>
                {project.href && project.status === "可体验" && (
                  <a href={project.href} className="mt-5 inline-flex w-fit items-center gap-2 text-sm text-[#536b50] transition-colors hover:text-[#283d29]">
                    立即体验 <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </section>
        ) : (
          <section className="relative mt-9 flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#e7e9df] bg-[#f1f5ed] px-6 py-10 text-center sm:min-h-[320px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(205,220,196,0.38),transparent_62%)]" />
            <div aria-hidden="true" className="relative flex size-14 items-center justify-center rounded-2xl border border-[#d9e3d4] bg-[#f8faf5] text-2xl font-light text-[#879982]">
              +
            </div>
            <p className="relative mt-6 text-[10px] tracking-[0.24em] text-[#929b8d]">WORKSHOP · 001</p>
            <h2 className="relative mt-3 text-lg font-medium tracking-[0.08em] text-[#465544] sm:text-xl">
              新作品正在路上
            </h2>
            <p className="relative mt-3 max-w-md text-sm leading-7 text-[#7a8475]">
              这里会收纳我制作的小程序、小工具和其他有趣的尝试。第一个作品准备好后，就会在这里和你见面。
            </p>
          </section>
        )}

        <p className="mt-6 text-center text-[11px] tracking-[0.12em] text-[#a0a095]">
          小程序 <span className="mx-2 text-[#c2c6b9]">·</span> 实用工具 <span className="mx-2 text-[#c2c6b9]">·</span> 实验性作品
        </p>
      </div>
    </main>
  );
}
