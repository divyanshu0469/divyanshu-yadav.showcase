import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  ReactElement,
} from "react";
import { Anton, Inter } from "next/font/google";
import dynamic from "next/dynamic";
import gsap from "gsap";
import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import AnimatedText from "@/components/1ffect/AnimatedText";
import Preloader from "@/components/1ffect/Preloader";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";
import { ThemeLayout } from "@/components/layouts";
import type { NextPageWithLayout } from "@/pages/_app";

import type { ParticleSceneHandle } from "@/components/1ffect/ParticleScene/ParticleScene";

const ParticleScene = dynamic(
  () => import("@/components/1ffect/ParticleScene/ParticleScene"),
  { ssr: false },
);

const PARTICLE_MODELS = [
  {
    name: "HONDA",
    file: "/1ffect/models/honda.glb",
    color1: "#ff2020",
    color2: "#ff4040",
    background: "#000",
    pointSize: 12.0,
    placeOnLoad: true,
  },
  {
    name: "CB650R",
    file: "/1ffect/models/cb650r.glb",
    color1: "#fbfbfb",
    color2: "#ffffff",
    background: "#d92330",
    pointSize: 12.0,
  },
];

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const CursorFollower = ({
  initialPosition,
}: {
  initialPosition: { x: number; y: number };
}) => {
  const squareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (squareRef.current) {
      gsap.set(squareRef.current, {
        x: initialPosition.x - 24,
        y: initialPosition.y - 24,
      });
    }
  }, [initialPosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (squareRef.current) {
        gsap.to(squareRef.current, {
          x: e.clientX - 24,
          y: e.clientY - 24,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={squareRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "20px",
        height: "20px",
        backgroundColor: "var(--color-fg)",
        border: "2px solid black",
        pointerEvents: "none",
        zIndex: 9999,
        animation: "blink 1.5s ease-in-out infinite",
      }}
    />
  );
};

const IMAGE_PATHS = [
  "/1ffect/images/cb650r-1.webp",
  "/1ffect/images/cb650r-2.webp",
  "/1ffect/images/cb650r-3.webp",
];

const OPEN_ANIM_DOWN = { yPercent: -100 };

const Effect1: NextPageWithLayout = () => {
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const [helpMode, setHelpMode] = useState(false);
  const [particleTextVisible, setParticleTextVisible] = useState(false);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);
  const arrowHeadLeftRef = useRef<SVGLineElement>(null);
  const arrowHeadRightRef = useRef<SVGLineElement>(null);
  const arrowShaftRef = useRef<SVGLineElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const targetRef = useRef(0);
  const heroRadiusOnRef = useRef(false);
  const particleSceneRef = useRef<ParticleSceneHandle>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const toggleStateRef = useRef(0);
  const toggleLockRef = useRef(false);
  const isMobileRef = useRef(false);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const lineNumberRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const lineTlRef = useRef<gsap.core.Timeline | null>(null);
  const linesOpenRef = useRef(false);
  const plusHRef = useRef<HTMLDivElement>(null);
  const revealImgRefs = useRef<(HTMLImageElement | null)[]>([null, null, null]);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const activeLineIndexRef = useRef<number | null>(null);

  useEffect(() => {
    isMobileRef.current = window.matchMedia("(max-width: 768px)").matches;
  }, []);

  useLayoutEffect(() => {
    if (particleRef.current) {
      gsap.set(particleRef.current, { yPercent: 100 });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorPosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrubTo = (value: number) => {
    const hero = heroRef.current;
    const tl = tlRef.current;
    if (!hero || !tl) return;

    const prev = targetRef.current;
    targetRef.current = Math.min(1, Math.max(0, value));

    // Hero: 0 → 1rem as soon as scroll starts
    if (!heroRadiusOnRef.current && targetRef.current > 0) {
      heroRadiusOnRef.current = true;
      gsap.to(hero, {
        borderRadius: "1rem",
        duration: 0.3,
        ease: "power2.out",
      });
    } else if (heroRadiusOnRef.current && targetRef.current === 0 && prev > 0) {
      heroRadiusOnRef.current = false;
      gsap.to(hero, { borderRadius: "0rem", duration: 0.3, ease: "power2.in" });
    }

    // 10-20%: chevron arms shrink toward center point (128, 216)
    const chevronProgress =
      targetRef.current <= 0.1
        ? 0
        : targetRef.current >= 0.2
          ? 1
          : (targetRef.current - 0.1) / 0.1;

    // 15-20%: chevron fades out
    const chevronOpacity =
      targetRef.current <= 0.15
        ? 1
        : targetRef.current >= 0.2
          ? 0
          : 1 - (targetRef.current - 0.15) / 0.05;

    if (arrowHeadLeftRef.current) {
      gsap.to(arrowHeadLeftRef.current, {
        attr: {
          x2: gsap.utils.interpolate(56, 128, chevronProgress),
          y2: gsap.utils.interpolate(144, 216, chevronProgress),
        },
        opacity: chevronOpacity,
        duration: 0.3,
        overwrite: true,
      });
    }
    if (arrowHeadRightRef.current) {
      gsap.to(arrowHeadRightRef.current, {
        attr: {
          x2: gsap.utils.interpolate(200, 128, chevronProgress),
          y2: gsap.utils.interpolate(144, 216, chevronProgress),
        },
        opacity: chevronOpacity,
        duration: 0.3,
        overwrite: true,
      });
    }

    if (isMobileRef.current) {
      // Mobile: 20-50% shaft fades, 30-60% button shrinks to zero
      const mobileShaftFade =
        targetRef.current <= 0.2
          ? 0
          : targetRef.current >= 0.5
            ? 1
            : (targetRef.current - 0.2) / 0.3;

      const mobileShrink =
        targetRef.current <= 0.3
          ? 0
          : targetRef.current >= 0.6
            ? 1
            : (targetRef.current - 0.3) / 0.3;

      if (arrowShaftRef.current) {
        gsap.to(arrowShaftRef.current, {
          opacity: 1 - mobileShaftFade,
          duration: 0.3,
          overwrite: true,
        });
      }

      if (scrollBtnRef.current) {
        gsap.to(scrollBtnRef.current, {
          width: gsap.utils.interpolate("2rem", "0rem", mobileShrink),
          height: gsap.utils.interpolate("3.5rem", "0rem", mobileShrink),
          opacity: 1 - mobileShrink,
          duration: 0.3,
          overwrite: true,
        });
      }
    } else {
      // Desktop: morph into toggle
      // 30-50%: swap button width/height and rotate shaft 90°
      const morphProgress =
        targetRef.current <= 0.3
          ? 0
          : targetRef.current >= 0.5
            ? 1
            : (targetRef.current - 0.3) / 0.2;

      if (scrollBtnRef.current) {
        gsap.to(scrollBtnRef.current, {
          width: gsap.utils.interpolate("3rem", "5rem", morphProgress),
          height: gsap.utils.interpolate("5rem", "3rem", morphProgress),
          duration: 0.3,
          overwrite: true,
        });
      }

      // 50-70%: shrink line length
      const shrinkProgress =
        targetRef.current <= 0.5
          ? 0
          : targetRef.current >= 0.7
            ? 1
            : (targetRef.current - 0.5) / 0.2;

      // 60-75%: shaft fades out
      const shaftFadeProgress =
        targetRef.current <= 0.6
          ? 0
          : targetRef.current >= 0.75
            ? 1
            : (targetRef.current - 0.6) / 0.15;

      // 80-95%: knob fades in
      const knobFadeProgress =
        targetRef.current <= 0.8
          ? 0
          : targetRef.current >= 0.95
            ? 1
            : (targetRef.current - 0.8) / 0.15;

      if (arrowShaftRef.current) {
        gsap.to(arrowShaftRef.current, {
          attr: {
            y1: gsap.utils.interpolate(40, 128, shrinkProgress),
            y2: gsap.utils.interpolate(216, 128, shrinkProgress),
          },
          opacity: 1 - shaftFadeProgress,
          rotation: 90 * morphProgress,
          transformOrigin: "center center",
          duration: 0.3,
          overwrite: true,
        });
      }

      // Knob: grow from center, then slide to toggle position
      if (knobRef.current && scrollBtnRef.current) {
        const btnW = scrollBtnRef.current.offsetWidth;
        const knobW = knobRef.current.offsetWidth;
        const pad = parseFloat(getComputedStyle(knobRef.current).left);
        const centerX = (btnW - knobW) / 2 - pad;
        const rightX = btnW - knobW - 2 * pad;
        const targetX = toggleStateRef.current === 0 ? 0 : rightX;

        gsap.to(knobRef.current, {
          opacity: knobFadeProgress > 0 ? 1 : 0,
          scale: knobFadeProgress,
          x: gsap.utils.interpolate(centerX, targetX, knobFadeProgress),
          duration: 0.3,
          overwrite: true,
        });
      }
    }

    // Show particle section text (one-time trigger)
    if (!particleTextVisible && targetRef.current >= 0.9) {
      setParticleTextVisible(true);
    }

    // Open/close lines based on scroll position
    if (targetRef.current >= 0.9 && !linesOpenRef.current) {
      linesOpenRef.current = true;

      // Build line timeline lazily on first open
      if (!lineTlRef.current) {
        const widthEase = "cubic-bezier(0.85, 0, 0.15, 1)";
        const textEase = "cubic-bezier(0.22, 1, 0.36, 1)";
        const stagger = 0.3;
        const expandedWidth = isMobileRef.current ? "3.25rem" : "4.25rem";
        const lineTl = gsap.timeline({ paused: true });

        lineRefs.current.forEach((el, idx) => {
          if (el) {
            lineTl.to(
              el,
              {
                width: expandedWidth,
                duration: 0.5,
                ease: widthEase,
              },
              idx * stagger,
            );
          }
        });

        const textStart = 0.5 + 2 * stagger;
        lineNumberRefs.current.forEach((el, idx) => {
          if (el) {
            const parentH = lineRefs.current[idx]?.offsetHeight ?? 0;
            lineTl.fromTo(
              el,
              { y: parentH },
              { y: 0, duration: 0.5, ease: textEase },
              textStart + idx * stagger,
            );
          }
        });

        lineTlRef.current = lineTl;
      }

      lineTlRef.current.play();
    } else if (targetRef.current < 0.7 && linesOpenRef.current) {
      linesOpenRef.current = false;
      lineTlRef.current?.reverse();
    }

    // Hide image on scroll-up: mobile at < 0.9 (10%), desktop at < 0.7 (30%)
    const imgHideThreshold = isMobileRef.current ? 0.9 : 0.7;
    if (
      targetRef.current < imgHideThreshold &&
      revealTlRef.current &&
      activeLineIndexRef.current !== null &&
      !revealTlRef.current.reversed()
    ) {
      revealTlRef.current.reverse();
    } else if (
      targetRef.current >= 0.9 &&
      revealTlRef.current &&
      activeLineIndexRef.current !== null &&
      revealTlRef.current.reversed()
    ) {
      const imgEl = revealImgRefs.current[activeLineIndexRef.current];
      if (imgEl) gsap.set(imgEl, { opacity: 1 });
      revealTlRef.current.play();
    }

    gsap.to(tl, {
      progress: targetRef.current,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    });
  };

  useEffect(() => {
    if (!animationsStarted) return;

    const page = pageRef.current;
    const hero = heroRef.current;
    const particle = particleRef.current;
    if (!page || !hero || !particle) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(hero, { scale: 0.9, ease: "none", duration: 1 }, 0);
    tl.fromTo(
      particle,
      { yPercent: 100 },
      { yPercent: 0, ease: "none", duration: 1 },
      0,
    );
    tl.fromTo(
      particle,
      { borderRadius: "1rem" },
      { borderRadius: "0rem", ease: "power2.out", duration: 0.3 },
      0.7,
    );
    tlRef.current = tl;

    const SCROLL_STEP = 0.04;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrubTo(targetRef.current + Math.sign(e.deltaY) * SCROLL_STEP);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      scrubTo(targetRef.current + Math.sign(deltaY) * SCROLL_STEP);
      touchStartY = currentY;
    };

    page.addEventListener("wheel", onWheel, { passive: false });
    page.addEventListener("touchstart", onTouchStart, { passive: true });
    page.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      page.removeEventListener("wheel", onWheel);
      page.removeEventListener("touchstart", onTouchStart);
      page.removeEventListener("touchmove", onTouchMove);
      tl.kill();
      tlRef.current = null;
    };
  }, [animationsStarted]);

  const handleButtonClick = () => {
    if (targetRef.current >= 0.9) {
      if (toggleLockRef.current) return;
      toggleLockRef.current = true;

      particleSceneRef.current?.toggleModel();
      const next = toggleStateRef.current === 0 ? 1 : 0;
      toggleStateRef.current = next;
      setActiveModelIndex(next);

      if (knobRef.current && scrollBtnRef.current) {
        const btnW = scrollBtnRef.current.offsetWidth;
        const knobW = knobRef.current.offsetWidth;
        const pad = parseFloat(getComputedStyle(knobRef.current).left);
        const rightX = btnW - knobW - 2 * pad;

        gsap.to(knobRef.current, {
          x: next === 0 ? 0 : rightX,
          duration: 0.3,
          ease: "power2.inOut",
        });
        setTimeout(() => {
          toggleLockRef.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          toggleLockRef.current = false;
        }, 500);
      }
    } else {
      const step = 0.04;
      const id = setInterval(() => {
        scrubTo(targetRef.current + step);
        if (targetRef.current >= 1) clearInterval(id);
      }, 35);
    }
  };

  const handleLineClick = (idx: number) => {
    const hEl = plusHRef.current;
    if (!hEl) return;

    const prevIdx = activeLineIndex;
    const isTogglingOff = prevIdx === idx;
    const isCrossTransition = prevIdx !== null && !isTogglingOff;

    const newIdx = isTogglingOff ? null : idx;
    setActiveLineIndex(newIdx);
    activeLineIndexRef.current = newIdx;

    // --- Toggle Off ---
    if (isTogglingOff) {
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      gsap.set(hEl, { opacity: 0 });

      // Clean up ALL images except the one being toggled off
      revealImgRefs.current.forEach((img, i) => {
        if (!img) return;
        gsap.killTweensOf(img);
        if (i !== idx) {
          gsap.set(img, { opacity: 0, scale: 1, clearProps: "zIndex,clipPath,transformOrigin" });
        }
      });

      const imgEl = revealImgRefs.current[idx];
      if (!imgEl) return;

      // Always close with scale-down from center
      gsap.set(imgEl, { clipPath: "none", transformOrigin: "center center" });
      const offTl = gsap.timeline({
        onComplete: () => {
          gsap.set(imgEl, { opacity: 0, scale: 1, clearProps: "zIndex,clipPath,transformOrigin" });
        },
      });
      offTl.to(imgEl, { scale: 0, duration: 0.5, ease: "power2.in" });

      return;
    }

    // --- Cross-Transition (new scales up from center over old) ---
    if (isCrossTransition) {
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      gsap.set(hEl, { opacity: 0 });

      const newImg = revealImgRefs.current[idx];
      if (!newImg) return;

      // Reset ALL images to clean state, then set up only old + new
      revealImgRefs.current.forEach((img, i) => {
        if (!img) return;
        if (i === prevIdx) {
          gsap.set(img, { opacity: 1, scale: 1, clipPath: "none", zIndex: 0, clearProps: "transformOrigin" });
        } else if (i === idx) {
          gsap.set(img, { opacity: 1, scale: 0, clipPath: "none", transformOrigin: "center center", zIndex: 1 });
        } else {
          gsap.set(img, { opacity: 0, scale: 1, clearProps: "zIndex,clipPath,transformOrigin" });
        }
      });

      const oldImg = revealImgRefs.current[prevIdx!];

      const crossTl = gsap.timeline({
        onComplete: () => {
          if (oldImg) gsap.set(oldImg, { opacity: 0, scale: 1, clearProps: "zIndex" });
          gsap.set(newImg, { clearProps: "zIndex" });
          // Build reversible state timeline for toggle-off / scroll-up
          const stateTl = gsap.timeline({ paused: true });
          stateTl.fromTo(
            newImg,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.8,
              ease: "power4.out",
              immediateRender: false,
            },
          );
          stateTl.progress(1);
          revealTlRef.current = stateTl;
        },
      });

      // New image scales from 0 to 1, covering the old image
      crossTl.to(newImg, { scale: 1, duration: 0.8, ease: "power4.out" }, 0);

      revealTlRef.current = crossTl;
      return;
    }

    // --- First Reveal (no image currently showing) ---
    revealTlRef.current?.kill();
    revealTlRef.current = null;

    // Reset all images to clean state
    revealImgRefs.current.forEach((img) => {
      if (img) {
        gsap.killTweensOf(img);
        gsap.set(img, { opacity: 0, scale: 1, clearProps: "zIndex,clipPath,transformOrigin" });
      }
    });

    const imgEl = revealImgRefs.current[idx];
    if (!imgEl) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const lineLength = Math.min(vw, vh) * (isMobileRef.current ? 0.7 : 0.7);
    const container = hEl.parentElement;
    if (container) gsap.set(container, { width: lineLength });
    gsap.set(hEl, { width: 0, opacity: 1, top: 0, clipPath: "none" });
    gsap.set(imgEl, { opacity: 1 });

    const imgH = imgEl.offsetHeight;
    const revealTl = gsap.timeline();

    // 1. Line grows left → right
    revealTl.to(hEl, {
      width: "100%",
      duration: 0.3,
      ease: "cubic-bezier(0.85, 0, 0.15, 1)",
    });

    // 2. Image reveals top → bottom, line follows the bottom edge, then disappears
    revealTl.fromTo(
      imgEl,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.out" },
      "reveal",
    );
    revealTl.to(
      hEl,
      {
        top: imgH,
        duration: 0.8,
        ease: "power4.out",
      },
      "reveal",
    );
    revealTl.set(hEl, { opacity: 0 });

    revealTlRef.current = revealTl;
  };

  const handlePreloaderComplete = () => {
    setAnimationsStarted(true);
  };

  const handleHelpToggle = () => {
    setHelpMode((v) => !v);
  };

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.heroWrapper}>
        <div ref={heroRef} className={styles.heroSection}>
          <AnimatedRedLines
            className={styles.redLines}
            startAnimation={animationsStarted}
          />
          <AnimatedHeader startAnimation={animationsStarted} />
        </div>
      </div>
      <div ref={particleRef} className={styles.particleWrapper}>
        <ParticleScene handleRef={particleSceneRef} models={PARTICLE_MODELS} />
        <div
          className={styles.particleOverlay}
          style={
            {
              "--text-color":
                activeModelIndex === 0
                  ? "var(--color-fg)"
                  : "var(--color-accent)",
              "--text-hover-color":
                activeModelIndex === 0
                  ? "var(--color-accent)"
                  : "var(--color-bg)",
            } as React.CSSProperties
          }
        >
          <AnimatedText
            label="Honda"
            duration={1.5}
            animationState={particleTextVisible}
            openAnimation={OPEN_ANIM_DOWN}
            className={styles.particleTitle}
          />
          <AnimatedText
            label="CB650R"
            delay={0.1}
            duration={1.5}
            animationState={particleTextVisible}
            openAnimation={OPEN_ANIM_DOWN}
            className={styles.particleTitle}
          />
          <div className={styles.particleFeatures}>
            <AnimatedText
              label="649cc Inline-Four Engine"
              delay={0.3}
              duration={1.5}
              animationState={particleTextVisible}
              openAnimation={OPEN_ANIM_DOWN}
              className={styles.particleFeature}
            />
            <AnimatedText
              label="Neo Sports Café Design"
              delay={0.5}
              duration={1.5}
              animationState={particleTextVisible}
              openAnimation={OPEN_ANIM_DOWN}
              className={styles.particleFeature}
            />
            <AnimatedText
              label="Showa SFF-BP Inverted Forks"
              delay={0.7}
              duration={1.5}
              animationState={particleTextVisible}
              openAnimation={OPEN_ANIM_DOWN}
              className={styles.particleFeature}
            />
            <AnimatedText
              label="Full-Color TFT Display"
              delay={0.9}
              duration={1.5}
              animationState={particleTextVisible}
              openAnimation={OPEN_ANIM_DOWN}
              className={styles.particleFeature}
            />
            <AnimatedText
              label="Lightweight & Agile"
              delay={1.1}
              duration={1.5}
              animationState={particleTextVisible}
              openAnimation={OPEN_ANIM_DOWN}
              className={styles.particleFeature}
            />
          </div>
        </div>
        <div className={styles.particleLines}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={styles.particleLine}
              onClick={() => handleLineClick(i)}
              style={
                {
                  backgroundColor:
                    activeModelIndex === 0
                      ? "var(--color-fg)"
                      : "var(--color-accent)",
                  borderLeft:
                    activeLineIndex === i
                      ? `0.25rem solid ${activeModelIndex === 0 ? "var(--color-accent)" : "var(--color-bg)"}`
                      : "none",
                  "--line-text-color":
                    activeModelIndex === 0
                      ? "var(--color-bg)"
                      : "var(--color-fg)",
                  "--line-text-hover":
                    activeModelIndex === 0
                      ? "var(--color-accent)"
                      : "var(--color-bg)",
                } as React.CSSProperties
              }
            >
              <span
                ref={(el) => {
                  lineNumberRefs.current[i] = el;
                }}
                className={styles.particleLineNumber}
              >
                N<sup>o</sup>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.revealContainer}>
          <div
            ref={plusHRef}
            className={styles.plusLine}
            style={{
              width: 0,
              height: "2px",
              backgroundColor:
                activeModelIndex === 0
                  ? "var(--color-fg)"
                  : "var(--color-accent)",
            }}
          />
          <div className={styles.revealImageStack}>
            {IMAGE_PATHS.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                ref={(el) => {
                  revealImgRefs.current[i] = el;
                }}
                src={src}
                alt={`Honda CB650R ${i + 1}`}
                className={styles.revealImage}
                style={{ opacity: 0 }}
              />
            ))}
          </div>
        </div>
      </div>
      <Preloader onComplete={handlePreloaderComplete} />
      {animationsStarted && (
        <>
          <button
            ref={scrollBtnRef}
            className={styles.scrollButton}
            onClick={handleButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <rect width="256" height="256" fill="none" />
              <line
                ref={arrowShaftRef}
                x1="128"
                y1="40"
                x2="128"
                y2="216"
                fill="none"
                stroke="var(--color-accent)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="8"
              />
              <line
                ref={arrowHeadLeftRef}
                x1="128"
                y1="216"
                x2="56"
                y2="144"
                fill="none"
                stroke="var(--color-accent)"
                strokeLinecap="round"
                strokeWidth="8"
              />
              <line
                ref={arrowHeadRightRef}
                x1="128"
                y1="216"
                x2="200"
                y2="144"
                fill="none"
                stroke="var(--color-accent)"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div ref={knobRef} className={styles.toggleKnob} />
          </button>
          {!isMobileRef.current && (
            <ToolBar
              foreground="var(--color-fg)"
              background="transparent"
              position={{ bottom: "2rem", right: "2rem" }}
              onHelpToggle={handleHelpToggle}
            />
          )}
          {helpMode && (
            <CursorFollower initialPosition={cursorPosition.current} />
          )}
        </>
      )}
    </div>
  );
};

Effect1.getLayout = (page: ReactElement) => {
  return (
    <ThemeLayout
      theme="1ffect"
      fontVariables={`${anton.variable} ${inter.variable}`}
    >
      {page}
    </ThemeLayout>
  );
};

export default Effect1;
