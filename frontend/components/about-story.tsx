"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  {
    id: "beginning",
    title: "我是一粒种子，带着远古的倔强，来赴一场生命浩荡的远航。",
    image: "/images/about/abstract/01-moss.webp",
    alt: "苔绿色水彩肌理中，一道浅色笔触斜向划过",
    paragraphs: [
      "我们的人的人生，从呱呱坠地那一刻起就已经开启了。",
      "那时候小小的他并不知道，世界很精彩，也很残酷。",
    ],
  },
  {
    id: "childhood",
    title: "我在大地上奔跑，风是我的衣裳，云是我的故乡。",
    image: "/images/about/abstract/02-graygreen.webp",
    alt: "灰绿色水彩与纸面纹理柔和交融",
    paragraphs: [
      "小时候顽皮，挨了不少打。",
      "虽懵懂无知，但也无忧无虑。",
    ],
  },
  {
    id: "youth",
    title: "当蜘蛛网无情地查封了我的炉台，我依然固执地铺平失望的灰烬，用美丽的雪花写下：相信未来。",
    image: "/images/about/abstract/03-mistblue.webp",
    alt: "雾蓝色水彩笔触形成向内旋转的弧线",
    paragraphs: [
      "“少年不知愁滋味，却道天凉好个秋”，长大了一些后，明白了一些事儿，虽有“为赋新词强说愁”之意，但少年的眉眼间浮现了几丝若有若无的焦虑。",
      "他见识了世界的美。如诗如画的山河美景，静谧安逸的街巷生活，温暖人心的人间互动，真情实意的兄弟朋友。",
      "他知道，美好一直在身边。",
    ],
  },
  {
    id: "struggle",
    title: "如果大地的每个角落都充满了光明，谁还需要星星，谁还会在夜里凝望，寻找遥远的安慰。",
    image: "/images/about/abstract/04-violet.webp",
    alt: "深紫色肌理沉入灰白纸面，边缘散落微小亮点",
    paragraphs: [
      "烦恼焦虑是他清楚的感受到自己的弱小后，慢慢滋生的。",
      "恨自己是个废物，什么事都不能坚持到底。",
      "他想有堂吉诃德的勇气，阿甘的自信，怪鸽的清醒，菊次郎的随意。",
    ],
  },
  {
    id: "forward",
    title: "走向远方，是为了让生命更辉煌，走在崎岖不平的路上，年轻的眼眸里装着梦，更装着思想。",
    image: "/images/about/abstract/05-silver.webp",
    alt: "银灰色纸面上，一道淡蓝色笔触延伸向远方",
    paragraphs: [
      "现实与理想的重重割裂，几乎将他埋葬。",
      "庆幸的是，他拥有极强的韧性。",
      "他是一个小人物，但也有自己的路要走。",
    ],
  },
];

export function AboutStory({ onReturn }: { onReturn: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFadeRef = useRef<gsap.core.Tween | null>(null);
  const memoryRingRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const memoryTweens = useRef<Record<string, gsap.core.Timeline | null>>({});
  const youthSetters = useRef<{
    imageX?: (value: number) => void;
    imageY?: (value: number) => void;
  }>({});
  const [activeChapter, setActiveChapter] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => () => {
    audioFadeRef.current?.kill();
    audioRef.current?.pause();
    Object.values(memoryTweens.current).forEach((timeline) => timeline?.kill());
    if (rootRef.current) {
      gsap.killTweensOf(rootRef.current.querySelectorAll(".about-chapter-image"));
    }
  }, []);

  function touchMemory(id: string) {
    const outer = memoryRingRefs.current[`${id}-outer`];
    const inner = memoryRingRefs.current[`${id}-inner`];
    if (!outer || !inner) return;

    memoryTweens.current[id]?.kill();
    gsap.set([outer, inner], { clearProps: "all" });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    memoryTweens.current[id] = gsap.timeline()
      .fromTo(outer, { scale: reduceMotion ? 1 : 0.25, autoAlpha: 0.72 }, { scale: reduceMotion ? 1 : 2.2, autoAlpha: 0, duration: reduceMotion ? 0.35 : 1.3, ease: "power2.out" })
      .fromTo(inner, { scale: reduceMotion ? 1 : 0.2, autoAlpha: 0.52 }, { scale: reduceMotion ? 1 : 1.55, autoAlpha: 0, duration: reduceMotion ? 0.35 : 1.15, ease: "power2.out" }, "<0.12");
  }

  function moveYouthScene(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const image = event.currentTarget.querySelector(".about-chapter-image");
    if (image) {
      const imageX = youthSetters.current.imageX ??= gsap.quickTo(image, "x", { duration: 0.8, ease: "power2.out" });
      const imageY = youthSetters.current.imageY ??= gsap.quickTo(image, "y", { duration: 0.8, ease: "power2.out" });
      imageX(x * 6);
      imageY(y * 3);
    }
  }

  function resetYouthScene() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    youthSetters.current.imageX?.(0);
    youthSetters.current.imageY?.(0);
  }

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>(".about-chapter");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      sections.forEach((section, index) => {
        const image = section.querySelector<HTMLElement>(".about-chapter-image");
        const copy = section.querySelector<HTMLElement>(".about-chapter-copy-content");

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });

        if (reduceMotion) return;

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.04, yPercent: 2 },
            {
              scale: 1.12,
              yPercent: -2,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { y: 24, autoAlpha: 0.48 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: copy,
                start: "top 88%",
                end: "top 48%",
                scrub: 0.6,
              },
            },
          );
        }

      });
    },
    { scope: rootRef },
  );

  return (
    <main ref={rootRef} className="about-story relative flex-1 bg-[#191817] text-[#282722]">
      <audio ref={audioRef} src="/audio/about-ambient-loop.mp3" loop preload="none" />

      <button
        type="button"
        onClick={onReturn}
        aria-label="回到关于页入口"
        className="fixed bottom-5 left-5 z-50 flex size-10 items-center justify-center rounded-full border border-white/25 bg-[#201f1d]/75 text-white/85 backdrop-blur-sm transition-colors hover:bg-[#201f1d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5m0 0 6 6m-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={async () => {
          const audio = audioRef.current;
          if (!audio) return;
          audioFadeRef.current?.kill();

          if (isMusicPlaying) {
            setIsMusicPlaying(false);
            audioFadeRef.current = gsap.to(audio, {
              volume: 0,
              duration: 0.9,
              onComplete: () => audio.pause(),
            });
            return;
          }

          try {
            audio.volume = 0;
            await audio.play();
            setIsMusicPlaying(true);
            audioFadeRef.current = gsap.to(audio, { volume: 0.32, duration: 1.4 });
          } catch {
            setIsMusicPlaying(false);
          }
        }}
        aria-label={isMusicPlaying ? "关闭背景音乐" : "开启背景音乐"}
        aria-pressed={isMusicPlaying}
        className="fixed bottom-5 right-5 z-50 flex size-10 items-center justify-center rounded-full border border-white/25 bg-[#201f1d]/75 text-white/85 backdrop-blur-sm transition-colors hover:bg-[#201f1d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4z" />
          {isMusicPlaying ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <path d="m16 9 5 6m0-6-5 6" />
          )}
        </svg>
      </button>

      <nav aria-label="叙事章节" className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3 rounded-full border border-white/10 bg-[#201f1d]/55 p-2 backdrop-blur-sm sm:right-6">
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#about-${chapter.id}`}
            aria-label={`第 ${index + 1} 段：${chapter.title}`}
            aria-current={activeChapter === index ? "step" : undefined}
            className={`block h-1 w-5 rounded-full transition-all duration-300 sm:w-7 ${activeChapter === index ? "bg-[#d4a66d]" : "bg-[#f4eee4]/45 hover:bg-[#f4eee4]/80"}`}
          />
        ))}
      </nav>

      {chapters.map((chapter, index) => (
        <section
          id={`about-${chapter.id}`}
          key={chapter.id}
          className="about-chapter relative"
          aria-labelledby={`about-title-${chapter.id}`}
        >
          <div
            className="about-chapter-visual sticky top-0 h-svh overflow-hidden"
            onPointerMove={chapter.id === "youth" ? moveYouthScene : undefined}
            onPointerLeave={chapter.id === "youth" ? resetYouthScene : undefined}
          >
            <Image
              src={chapter.image}
              alt={chapter.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="about-chapter-image object-cover"
            />
            {(chapter.id === "beginning" || chapter.id === "youth" || chapter.id === "forward") && (
              <button
                type="button"
                aria-label={chapter.id === "beginning" ? "轻触微光" : chapter.id === "youth" ? "轻触街巷中的微光" : "轻触延伸的线条"}
                onClick={() => touchMemory(chapter.id)}
                className={`group absolute z-20 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none after:absolute after:size-2 after:rounded-full after:bg-[#e7c99d]/85 after:shadow-[0_0_12px_rgba(231,201,157,0.75)] after:content-[''] focus-visible:ring-1 focus-visible:ring-white/70 ${chapter.id === "beginning" ? "left-[53%] top-[52%]" : chapter.id === "youth" ? "left-[39%] top-[50%]" : "left-[53%] top-[54%]"}`}
              >
                <span
                  ref={(element) => { memoryRingRefs.current[`${chapter.id}-outer`] = element; }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-5 rounded-full border border-white/65 opacity-0"
                />
                <span
                  ref={(element) => { memoryRingRefs.current[`${chapter.id}-inner`] = element; }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-7 rounded-full border border-[#e7c99d]/75 opacity-0"
                />
              </button>
            )}

          </div>
          <div className="about-chapter-copy relative z-10 border-t border-[#b9b0a2]/35 bg-[#e9e4da] px-7 py-16 text-[#292823] sm:px-[12vw] sm:py-24">
            <div className="about-chapter-copy-content mx-auto max-w-3xl">
              <h2
                id={`about-title-${chapter.id}`}
                className="mb-8 text-lg font-light leading-relaxed tracking-[0.04em] sm:text-xl md:text-2xl"
              >
                {chapter.title}
              </h2>
              <div className="space-y-5 text-sm font-light leading-[2.1] tracking-[0.06em] sm:text-base md:text-lg">
                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
