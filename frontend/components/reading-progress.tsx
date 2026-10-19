"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const nextProgress =
          scrollableHeight <= 0
            ? 100
            : (window.scrollY / scrollableHeight) * 100;

        setProgress(Math.min(100, Math.max(0, nextProgress)));
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      aria-label="阅读进度"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(progress)}
      className="fixed inset-x-0 top-0 z-50 h-1 bg-[#e8e8db]/80"
      role="progressbar"
    >
      <div
        className="h-full origin-left bg-[#777b63] transition-transform duration-150"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
