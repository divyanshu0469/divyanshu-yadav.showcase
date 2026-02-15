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

const OPEN_ANIM_DOWN = { yPercent: -100 };

const Effect1: NextPageWithLayout = () => {
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const [helpMode, setHelpMode] = useState(false);
  const [particleTextVisible, setParticleTextVisible] = useState(false);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
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
          style={{
            "--text-color": activeModelIndex === 0 ? "var(--color-fg)" : "var(--color-accent)",
            "--text-hover-color": activeModelIndex === 0 ? "var(--color-accent)" : "var(--color-bg)",
          } as React.CSSProperties}
        >
          <AnimatedText
            label="Honda CB650R"
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
      </div>
      <Preloader onComplete={handlePreloaderComplete} />
      {animationsStarted && (
        <>
          <button
            ref={scrollBtnRef}
            className={styles.scrollButton}
            onClick={handleButtonClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
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
