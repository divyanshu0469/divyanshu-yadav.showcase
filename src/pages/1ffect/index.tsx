import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  ReactElement,
} from "react";
import { Anton, Inter } from "next/font/google";
import dynamic from "next/dynamic";
import gsap from "gsap";
import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import Preloader from "@/components/1ffect/Preloader";
import CursorFollower from "@/components/1ffect/CursorFollower";
import ParticleOverlay from "@/components/1ffect/ParticleOverlay";
import ParticleLines from "@/components/1ffect/ParticleLines";
import ImageReveal from "@/components/1ffect/ImageReveal";
import ScrollButton from "@/components/1ffect/ScrollButton";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";
import { ThemeLayout } from "@/components/layouts";
import type { NextPageWithLayout } from "@/pages/_app";
import type { ParticleSceneHandle } from "@/components/1ffect/ParticleScene/ParticleScene";
import type { ParticleLinesHandle } from "@/components/1ffect/ParticleLines";
import type { ImageRevealHandle } from "@/components/1ffect/ImageReveal";
import type { ScrollButtonHandle } from "@/components/1ffect/ScrollButton";

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

const SCROLL_STEP = 0.04;
const SCROLL_STEP_MOBILE = 0.02;

/** Clamp a value into a 0-1 progress between min and max thresholds. */
const range01 = (value: number, min: number, max: number) =>
  value <= min ? 0 : value >= max ? 1 : (value - min) / (max - min);

/** Reset an image element to its default hidden state. */
const resetImage = (img: HTMLElement) =>
  gsap.set(img, { opacity: 0, scale: 1, clearProps: "zIndex,clipPath,transformOrigin" });

/** Get the rightmost knob x-offset for the toggle button. */
const getKnobRightX = (sb: ScrollButtonHandle) => {
  const btnW = sb.buttonRef!.offsetWidth;
  const knobW = sb.knobRef!.offsetWidth;
  const pad = parseFloat(getComputedStyle(sb.knobRef!).left);
  return btnW - knobW - 2 * pad;
};

/** Hook that keeps a state and a ref in sync. */
function useStateRef<T>(initial: T) {
  const [state, setState] = useState(initial);
  const ref = useRef(initial);
  const set = useCallback((v: T) => {
    ref.current = v;
    setState(v);
  }, []);
  return [state, set, ref] as const;
}

const Effect1: NextPageWithLayout = () => {
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const [helpMode, setHelpMode] = useState(false);
  const [particleTextVisible, setParticleTextVisible] = useState(false);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex, activeLineIndexRef] = useStateRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const cursorPosition = useRef({ x: 0, y: 0 });
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const particleSceneRef = useRef<ParticleSceneHandle>(null);
  const scrollButtonRef = useRef<ScrollButtonHandle>(null);
  const particleLinesRef = useRef<ParticleLinesHandle>(null);
  const imageRevealRef = useRef<ImageRevealHandle>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const targetRef = useRef(0);
  const heroRadiusOnRef = useRef(false);
  const toggleStateRef = useRef(0);
  const toggleLockRef = useRef(false);
  const isMobileRef = useRef(false);
  const lineTlRef = useRef<gsap.core.Timeline | null>(null);
  const linesOpenRef = useRef(false);
  const revealTlRef = useRef<gsap.core.Timeline | null>(null);
  const particleTextShownRef = useRef(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    isMobileRef.current = mobile;
    setIsMobile(mobile);
    if (mobile) {
      setActiveLineIndex(0);
      setActiveModelIndex(1);
      toggleStateRef.current = 1;
    }
  }, [setActiveLineIndex]);

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

  // --- Build line timeline once particle lines are available ---
  const buildLineTimeline = useCallback(() => {
    const pl = particleLinesRef.current;
    if (lineTlRef.current || !pl) return;

    const sizeEase = "cubic-bezier(0.85, 0, 0.15, 1)";
    const textEase = "cubic-bezier(0.22, 1, 0.36, 1)";
    const stagger = 0.3;
    const isMobile = isMobileRef.current;
    const expandedSize = isMobile ? "3.25rem" : "4.25rem";
    const sizeProp = isMobile ? "height" : "width";
    const lineTl = gsap.timeline({ paused: true });

    pl.lineRefs.forEach((el, idx) => {
      if (el) {
        lineTl.to(el, { [sizeProp]: expandedSize, duration: 0.5, ease: sizeEase }, idx * stagger);
      }
    });

    const textStart = 0.5 + 2 * stagger;
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    pl.lineNumberRefs.forEach((el, idx) => {
      if (el) {
        const slideDistance = isMobile
          ? parseFloat(expandedSize) * rootFontSize
          : (pl.lineRefs[idx]?.offsetHeight ?? 0);
        lineTl.fromTo(el, { y: slideDistance }, { y: 0, duration: 0.5, ease: textEase }, textStart + idx * stagger);
      }
    });

    lineTlRef.current = lineTl;
  }, []);

  // --- Scroll scrub orchestrator ---
  const scrubTo = useCallback((value: number) => {
    const hero = heroRef.current;
    const tl = tlRef.current;
    if (!hero || !tl) return;

    const prev = targetRef.current;
    targetRef.current = Math.min(1, Math.max(0, value));

    const sb = scrollButtonRef.current;
    const t = targetRef.current;

    // Hero border-radius toggle
    if (!heroRadiusOnRef.current && t > 0) {
      heroRadiusOnRef.current = true;
      gsap.to(hero, { borderRadius: "1rem", duration: 0.3, ease: "power2.out" });
    } else if (heroRadiusOnRef.current && t === 0 && prev > 0) {
      heroRadiusOnRef.current = false;
      gsap.to(hero, { borderRadius: "0rem", duration: 0.3, ease: "power2.in" });
    }

    // Chevron collapse: 10-20%
    const chevronProgress = range01(t, 0.1, 0.2);
    const chevronOpacity = 1 - range01(t, 0.15, 0.2);

    if (sb?.arrowHeadLeftRef) {
      gsap.to(sb.arrowHeadLeftRef, {
        attr: {
          x2: gsap.utils.interpolate(56, 128, chevronProgress),
          y2: gsap.utils.interpolate(144, 216, chevronProgress),
        },
        opacity: chevronOpacity,
        duration: 0.3,
        overwrite: true,
      });
    }
    if (sb?.arrowHeadRightRef) {
      gsap.to(sb.arrowHeadRightRef, {
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
      // Mobile: shaft fades 20-50%, button shrinks 30-60%
      const mobileShaftFade = range01(t, 0.2, 0.5);
      const mobileShrink = range01(t, 0.3, 0.6);

      if (sb?.arrowShaftRef) {
        gsap.to(sb.arrowShaftRef, {
          opacity: 1 - mobileShaftFade,
          duration: 0.3,
          overwrite: true,
        });
      }
      if (sb?.buttonRef) {
        gsap.to(sb.buttonRef, {
          width: gsap.utils.interpolate("2rem", "0rem", mobileShrink),
          height: gsap.utils.interpolate("3.5rem", "0rem", mobileShrink),
          opacity: 1 - mobileShrink,
          duration: 0.3,
          overwrite: true,
        });
      }
    } else {
      // Desktop: morph to toggle 30-50%
      const morphProgress = range01(t, 0.3, 0.5);
      const shrinkProgress = range01(t, 0.5, 0.7);
      const shaftFadeProgress = range01(t, 0.6, 0.75);
      const knobFadeProgress = range01(t, 0.8, 0.95);

      if (sb?.buttonRef) {
        gsap.to(sb.buttonRef, {
          width: gsap.utils.interpolate("3rem", "5rem", morphProgress),
          height: gsap.utils.interpolate("5rem", "3rem", morphProgress),
          duration: 0.3,
          overwrite: true,
        });
      }

      if (sb?.arrowShaftRef) {
        gsap.to(sb.arrowShaftRef, {
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

      if (sb?.knobRef && sb?.buttonRef) {
        const rightX = getKnobRightX(sb);
        const btnW = sb.buttonRef.offsetWidth;
        const knobW = sb.knobRef.offsetWidth;
        const pad = parseFloat(getComputedStyle(sb.knobRef).left);
        const centerX = (btnW - knobW) / 2 - pad;
        const targetX = toggleStateRef.current === 0 ? 0 : rightX;

        gsap.to(sb.knobRef, {
          opacity: knobFadeProgress > 0 ? 1 : 0,
          scale: knobFadeProgress,
          x: gsap.utils.interpolate(centerX, targetX, knobFadeProgress),
          duration: 0.3,
          overwrite: true,
        });
      }
    }

    // Show particle text at 90% (one-shot via ref — avoids stale closure)
    if (!particleTextShownRef.current && t >= 0.9) {
      particleTextShownRef.current = true;
      setParticleTextVisible(true);
    }

    // Open/close lines at 90% / 70%
    if (t >= 0.9 && !linesOpenRef.current) {
      linesOpenRef.current = true;
      buildLineTimeline();
      lineTlRef.current?.play();
    } else if (t < 0.7 && linesOpenRef.current) {
      linesOpenRef.current = false;
      lineTlRef.current?.reverse();
    }

    // Hide image on scroll threshold (smooth reverse, no re-show)
    const imgHideThreshold = isMobileRef.current ? 0.9 : 0.7;
    if (
      t < imgHideThreshold &&
      revealTlRef.current &&
      activeLineIndexRef.current !== null &&
      !revealTlRef.current.reversed()
    ) {
      revealTlRef.current.reverse();
      revealTlRef.current.eventCallback("onReverseComplete", () => {
        revealTlRef.current = null;
        setActiveLineIndex(null);
        const ir = imageRevealRef.current;
        if (ir) {
          ir.revealImgRefs.forEach((img) => {
            if (img) resetImage(img);
          });
          if (ir.plusHRef) gsap.set(ir.plusHRef, { opacity: 0 });
        }
      });
    }

    gsap.to(tl, {
      progress: t,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    });
  }, [buildLineTimeline]);

  // --- Scroll timeline setup ---
  useEffect(() => {
    if (!animationsStarted) return;

    const page = pageRef.current;
    const hero = heroRef.current;
    const particle = particleRef.current;
    if (!page || !hero || !particle) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(hero, { scale: 0.9, ease: "none", duration: 1 }, 0);
    tl.fromTo(particle, { yPercent: 100 }, { yPercent: 0, ease: "none", duration: 1 }, 0);
    tl.fromTo(particle, { borderRadius: "1rem" }, { borderRadius: "0rem", ease: "power2.out", duration: 0.3 }, 0.7);
    tlRef.current = tl;

    const step = isMobileRef.current ? SCROLL_STEP_MOBILE : SCROLL_STEP;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrubTo(targetRef.current + Math.sign(e.deltaY) * step);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = touchStartY - e.touches[0].clientY;
      scrubTo(targetRef.current + Math.sign(deltaY) * step);
      touchStartY = e.touches[0].clientY;
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
  }, [animationsStarted, scrubTo]);

  // --- Button click: toggle model or auto-scroll ---
  const handleButtonClick = useCallback(() => {
    if (targetRef.current >= 0.9) {
      if (toggleLockRef.current) return;
      toggleLockRef.current = true;

      particleSceneRef.current?.toggleModel();
      const next = toggleStateRef.current === 0 ? 1 : 0;
      toggleStateRef.current = next;
      setActiveModelIndex(next);

      const sb = scrollButtonRef.current;
      if (sb?.knobRef && sb?.buttonRef) {
        gsap.to(sb.knobRef, {
          x: next === 0 ? 0 : getKnobRightX(sb),
          duration: 0.3,
          ease: "power2.inOut",
        });
      }

      setTimeout(() => { toggleLockRef.current = false; }, 500);
    } else {
      const id = setInterval(() => {
        scrubTo(targetRef.current + SCROLL_STEP);
        if (targetRef.current >= 1) clearInterval(id);
      }, 35);
    }
  }, [scrubTo]);

  // --- Image reveal click handler ---
  const handleLineClick = useCallback((idx: number) => {
    const ir = imageRevealRef.current;
    if (!ir?.plusHRef) return;
    const hEl = ir.plusHRef;

    const prevIdx = activeLineIndexRef.current;
    const isTogglingOff = prevIdx === idx;
    const isCrossTransition = prevIdx !== null && !isTogglingOff;

    const newIdx = isTogglingOff ? null : idx;
    setActiveLineIndex(newIdx);

    // --- Toggle Off ---
    if (isTogglingOff) {
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      gsap.set(hEl, { opacity: 0 });

      ir.revealImgRefs.forEach((img, i) => {
        if (!img) return;
        gsap.killTweensOf(img);
        if (i !== idx) resetImage(img);
      });

      const imgEl = ir.revealImgRefs[idx];
      if (!imgEl) return;

      gsap.set(imgEl, { clipPath: "none", transformOrigin: "center center" });
      const offTl = gsap.timeline({
        onComplete: () => { resetImage(imgEl); },
      });
      offTl.to(imgEl, { scale: 0, duration: 0.5, ease: "power2.in" });
      return;
    }

    // --- Cross-Transition ---
    if (isCrossTransition) {
      revealTlRef.current?.kill();
      revealTlRef.current = null;
      gsap.set(hEl, { opacity: 0 });

      const newImg = ir.revealImgRefs[idx];
      if (!newImg) return;

      ir.revealImgRefs.forEach((img, i) => {
        if (!img) return;
        if (i === prevIdx) {
          gsap.set(img, { opacity: 1, scale: 1, clipPath: "none", zIndex: 0, clearProps: "transformOrigin" });
        } else if (i === idx) {
          gsap.set(img, { opacity: 1, scale: 0, clipPath: "none", transformOrigin: "center center", zIndex: 1 });
        } else {
          resetImage(img);
        }
      });

      const oldImg = ir.revealImgRefs[prevIdx!];
      const crossTl = gsap.timeline({
        onComplete: () => {
          if (oldImg) gsap.set(oldImg, { opacity: 0, scale: 1, clearProps: "zIndex" });
          gsap.set(newImg, { clearProps: "zIndex" });
          const stateTl = gsap.timeline({ paused: true });
          stateTl.fromTo(
            newImg,
            { scale: 0 },
            { scale: 1, duration: 0.8, ease: "power4.out", immediateRender: false },
          );
          stateTl.progress(1);
          revealTlRef.current = stateTl;
        },
      });
      crossTl.to(newImg, { scale: 1, duration: 0.8, ease: "power4.out" }, 0);
      revealTlRef.current = crossTl;
      return;
    }

    // --- First Reveal ---
    revealTlRef.current?.kill();
    revealTlRef.current = null;

    ir.revealImgRefs.forEach((img) => {
      if (img) {
        gsap.killTweensOf(img);
        resetImage(img);
      }
    });

    const imgEl = ir.revealImgRefs[idx];
    if (!imgEl) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const lineLength = Math.min(vw, vh) * 0.7;
    const container = hEl.parentElement;
    if (container) gsap.set(container, { width: lineLength });
    gsap.set(hEl, { width: 0, opacity: 1, top: 0, clipPath: "none" });
    gsap.set(imgEl, { opacity: 1 });

    const imgH = imgEl.offsetHeight;
    const revealTl = gsap.timeline();

    revealTl.to(hEl, {
      width: "100%",
      duration: 0.3,
      ease: "cubic-bezier(0.85, 0, 0.15, 1)",
    });

    revealTl.fromTo(
      imgEl,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.out" },
      "reveal",
    );
    revealTl.to(hEl, { top: imgH, duration: 0.8, ease: "power4.out" }, "reveal");
    revealTl.set(hEl, { opacity: 0 });

    revealTlRef.current = revealTl;
  }, [setActiveLineIndex]);

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

      <div ref={particleRef} className={styles.particleWrapper} style={{ backgroundColor: isMobile ? "#d92330" : "#000" }}>
        {!isMobile && <ParticleScene handleRef={particleSceneRef} models={PARTICLE_MODELS} />}
        <div className={styles.grain} />
        <ParticleOverlay
          activeModelIndex={activeModelIndex}
          particleTextVisible={particleTextVisible}
        />
        <ParticleLines
          ref={particleLinesRef}
          activeModelIndex={activeModelIndex}
          activeLineIndex={activeLineIndex}
          onLineClick={handleLineClick}
        />
        <ImageReveal
          ref={imageRevealRef}
          activeModelIndex={activeModelIndex}
        />
      </div>

      <Preloader onComplete={() => setAnimationsStarted(true)} />

      {animationsStarted && (
        <>
          <ScrollButton ref={scrollButtonRef} onClick={handleButtonClick} />
          {!isMobileRef.current && (
            <ToolBar
              foreground="var(--color-fg)"
              background="transparent"
              position={{ bottom: "2rem", right: "2rem" }}
              onHelpToggle={() => setHelpMode((v) => !v)}
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
