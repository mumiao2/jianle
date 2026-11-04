"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AboutStory } from "@/components/about-story";

gsap.registerPlugin(useGSAP);

const HOLD_TO_OPEN_MS = 900;

export function AboutDoor() {
  const stageRef = useRef<HTMLElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const leftRingRef = useRef<SVGGElement>(null);
  const rightRingRef = useRef<SVGGElement>(null);
  const leftChargeRef = useRef<SVGCircleElement>(null);
  const rightChargeRef = useRef<SVGCircleElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const leftCopyRef = useRef<HTMLParagraphElement>(null);
  const rightCopyRef = useRef<HTMLHeadingElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionsRef = useRef<{
    resetCharge: () => void;
    startCharge: () => void;
    rattleRings: () => void;
    openDoors: () => void;
  } | null>(null);
  const didLongPress = useRef(false);
  const isAnimating = useRef(false);
  const isOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useGSAP(
    (context) => {
      const contextSafe = (name: string, callback: () => void): (() => void) =>
        context.add(name, callback) as () => void;

      gsap.set([leftDoorRef.current, rightDoorRef.current], {
        rotateY: 0,
        transformPerspective: 1600,
      });
      gsap.set(leftDoorRef.current, { transformOrigin: "left center" });
      gsap.set(rightDoorRef.current, { transformOrigin: "right center" });
      gsap.set([leftRingRef.current, rightRingRef.current], { transformOrigin: "50% 0%" });
      gsap.set([leftChargeRef.current, rightChargeRef.current], {
        strokeDasharray: 226,
        strokeDashoffset: 226,
      });
      gsap.set(lightRef.current, { autoAlpha: 0, scaleY: 0.15 });

      const resetCharge = contextSafe("resetCharge", () => {
        const charges = [leftChargeRef.current, rightChargeRef.current].filter(Boolean);
        gsap.killTweensOf(charges);
        gsap.set(charges, { strokeDashoffset: 226 });
      });
      const startCharge = contextSafe("startCharge", () => {
        const charges = [leftChargeRef.current, rightChargeRef.current].filter(Boolean);
        gsap.killTweensOf(charges);
        gsap.fromTo(charges, { strokeDashoffset: 226 }, {
          strokeDashoffset: 0,
          duration: HOLD_TO_OPEN_MS / 1000,
          ease: "none",
        });
      });
      const rattleRings = contextSafe("rattleRings", () => {
        if (isAnimating.current) return;
        const rings = [leftRingRef.current, rightRingRef.current].filter(Boolean);
        gsap.killTweensOf(rings);
        gsap.timeline({ defaults: { ease: "power1.inOut" } })
          .to(rings, { rotation: 13, duration: 0.1, stagger: 0.025 })
          .to(rings, { rotation: -10, duration: 0.13, stagger: 0.025 })
          .to(rings, { rotation: 7, duration: 0.12, stagger: 0.025 })
          .to(rings, { rotation: 0, duration: 0.22, stagger: 0.025, ease: "elastic.out(1, 0.45)" });
      });
      const openDoors = contextSafe("openDoors", () => {
        if (isAnimating.current || isOpenRef.current) return;
        isAnimating.current = true;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const duration = reducedMotion ? 0.01 : 1.35;
        animationRef.current?.kill();
        animationRef.current = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            isAnimating.current = false;
            isOpenRef.current = true;
            setIsOpen(true);
          },
        })
          .to([leftCopyRef.current, rightCopyRef.current], { autoAlpha: 0, y: -10, duration: reducedMotion ? 0.01 : 0.3 })
          .to(lightRef.current, { autoAlpha: 1, scaleY: 1, duration: reducedMotion ? 0.01 : 0.9, ease: "power2.out" })
          .to(leftDoorRef.current, { rotateY: 78, duration }, "<0.04")
          .to(rightDoorRef.current, { rotateY: -78, duration }, "<");
      });
      actionsRef.current = { resetCharge, startCharge, rattleRings, openDoors };
      return () => { actionsRef.current = null; };
    },
    { scope: stageRef },
  );

  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    animationRef.current?.kill();
  }, []);

  function clearHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setIsHolding(false);
    actionsRef.current?.resetCharge();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isOpen || isAnimating.current || event.button !== 0) return;
    event.preventDefault();
    didLongPress.current = false;
    setIsHolding(true);
    actionsRef.current?.startCharge();
    holdTimer.current = setTimeout(() => {
      didLongPress.current = true;
      holdTimer.current = null;
      setIsHolding(false);
      actionsRef.current?.openDoors();
    }, HOLD_TO_OPEN_MS);
  }

  function handlePointerUp() {
    clearHold();
    if (!didLongPress.current && !isOpen) actionsRef.current?.rattleRings();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      actionsRef.current?.openDoors();
    }
  }

  function returnToDoor() {
    animationRef.current?.kill();
    isAnimating.current = false;
    isOpenRef.current = false;
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo(0, 0);
    gsap.set([leftDoorRef.current, rightDoorRef.current], { rotateY: 0 });
    gsap.set(lightRef.current, { autoAlpha: 0, scaleY: 0.15 });
    gsap.set([leftCopyRef.current, rightCopyRef.current], { autoAlpha: 1, y: 0 });
    setIsOpen(false);
  }

  return (
    <>
    <main
      ref={stageRef}
      hidden={isOpen}
      className="relative isolate flex min-h-[calc(100svh-8.5rem)] flex-1 gap-1 overflow-hidden bg-[#dcebd8] text-[#344435] [perspective:1600px]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,230,0.8),transparent_38%)]" />
      <div ref={lightRef} aria-hidden="true" className="about-door-light pointer-events-none absolute inset-y-0 left-1/2 z-30 w-2 -translate-x-1/2 sm:w-3" />

      <div
        ref={leftDoorRef}
        role="button"
        tabIndex={0}
        aria-label="左侧门扇，轻点摇动门环，长按打开双门"
        aria-describedby="door-instructions"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearHold}
        onPointerLeave={clearHold}
        onKeyDown={handleKeyDown}
        className={`about-door-leaf relative z-10 flex min-h-[calc(100svh-8.5rem)] w-1/2 flex-1 cursor-grab select-none items-center justify-center border-r border-[#d5e5d1] px-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#91ae8d] sm:px-10 ${isHolding ? "cursor-grabbing" : ""}`}
      >
        <div className="pointer-events-none -translate-y-10 translate-x-3 sm:-translate-y-14 sm:translate-x-6">
          <p ref={leftCopyRef} className="[writing-mode:vertical-rl] [text-orientation:upright] text-base font-light leading-[1.7] tracking-[0.12em] sm:text-lg md:text-xl">
            世界很大很美，而我们
          </p>
        </div>
        <SimpleRing chargeRef={leftChargeRef} ringRef={leftRingRef} side="left" />
      </div>

      <div
        ref={rightDoorRef}
        role="button"
        tabIndex={0}
        aria-label="右侧门扇，轻点摇动门环，长按打开双门"
        aria-describedby="door-instructions"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearHold}
        onPointerLeave={clearHold}
        onKeyDown={handleKeyDown}
        className={`about-door-leaf relative z-10 flex min-h-[calc(100svh-8.5rem)] w-1/2 flex-1 cursor-grab select-none items-center justify-center border-l border-[#d5e5d1] px-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#91ae8d] sm:px-10 ${isHolding ? "cursor-grabbing" : ""}`}
      >
        <h1 ref={rightCopyRef} className="pointer-events-none translate-y-10 -translate-x-3 [writing-mode:vertical-rl] [text-orientation:upright] text-base font-medium leading-[1.7] tracking-[0.12em] sm:translate-y-14 sm:-translate-x-6 sm:text-lg md:text-xl">
          需要守好自己的一方净土
        </h1>
        <SimpleRing chargeRef={rightChargeRef} ringRef={rightRingRef} side="right" />
      </div>

      <p id="door-instructions" aria-live="polite" className="sr-only">
        {isOpen ? "你已推开这扇门" : isHolding ? "门扉正在回应……" : "轻点任一侧摇动门环 · 长按打开双门"}
      </p>

      <p aria-hidden="true" className="pointer-events-none absolute bottom-5 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#b8cbb2]/70 bg-[#f6faf2]/80 px-4 py-2 text-xs tracking-[0.08em] text-[#566b53] shadow-sm backdrop-blur-sm sm:bottom-7 sm:text-sm">
        轻触摇动门环 · 长按打开
      </p>

    </main>
    {isOpen && <AboutStory onReturn={returnToDoor} />}
    </>
  );
}

function SimpleRing({
  chargeRef,
  ringRef,
  side,
}: {
  chargeRef: React.Ref<SVGCircleElement>;
  ringRef: React.Ref<SVGGElement>;
  side: "left" | "right";
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 100"
      className={`pointer-events-none absolute top-1/2 z-20 h-14 w-12 -translate-y-1/2 sm:h-16 sm:w-14 ${side === "left" ? "right-3 sm:right-5" : "left-3 sm:left-5"}`}
    >
      <circle ref={chargeRef} cx="40" cy="50" r="36" fill="none" stroke="#839b7e" strokeWidth="1.5" className="door-ring-charge" />
      <path d="M40 12v12" stroke="#81977d" strokeWidth="2" strokeLinecap="round" />
      <g ref={ringRef}>
        <ellipse cx="40" cy="55" rx="12" ry="19" fill="none" stroke="#71876e" strokeWidth="2" />
        <ellipse cx="40" cy="55" rx="8" ry="14" fill="none" stroke="#a7bba0" strokeWidth="1" />
      </g>
    </svg>
  );
}

