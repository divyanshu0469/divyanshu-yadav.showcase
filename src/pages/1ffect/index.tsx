import { useState, useEffect, useLayoutEffect, useRef, ReactElement } from "react";
import { Anton, Inter } from "next/font/google";
import dynamic from "next/dynamic";
import gsap from "gsap";
import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import Preloader from "@/components/1ffect/Preloader";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";
import { ThemeLayout } from "@/components/layouts";
import type { NextPageWithLayout } from "@/pages/_app";

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

const CursorFollower = ({ initialPosition }: { initialPosition: { x: number; y: number } }) => {
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

const Effect1: NextPageWithLayout = () => {
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const [helpMode, setHelpMode] = useState(false);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!animationsStarted) return;

    const page = pageRef.current;
    const hero = heroRef.current;
    const particle = particleRef.current;
    if (!page || !hero || !particle) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(hero, { scale: 0.9, ease: "none", duration: 1 }, 0);
    tl.fromTo(particle, { yPercent: 100 }, { yPercent: 0, ease: "none", duration: 1 }, 0);
    // Particle border-radius: 1rem → 0 over the last 30% of scroll
    tl.fromTo(particle, { borderRadius: "1rem" }, { borderRadius: "0rem", ease: "power2.out", duration: 0.3 }, 0.7);

    let target = 0;
    let heroRadiusOn = false;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const prev = target;
      target = Math.min(1, Math.max(0, target + e.deltaY * 0.001));

      // Hero: 0 → 1rem as soon as scroll starts
      if (!heroRadiusOn && target > 0) {
        heroRadiusOn = true;
        gsap.to(hero, { borderRadius: "1rem", duration: 0.3, ease: "power2.out" });
      } else if (heroRadiusOn && target === 0 && prev > 0) {
        heroRadiusOn = false;
        gsap.to(hero, { borderRadius: "0rem", duration: 0.3, ease: "power2.in" });
      }

      gsap.to(tl, {
        progress: target,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    };

    page.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      page.removeEventListener("wheel", onWheel);
      tl.kill();
    };
  }, [animationsStarted]);

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
        <ParticleScene models={PARTICLE_MODELS} />
      </div>
      <Preloader onComplete={handlePreloaderComplete} />
      {animationsStarted && (
        <>
          <ToolBar
            foreground="var(--color-fg)"
            background="transparent"
            position={{ bottom: "2rem", right: "2rem" }}
            onHelpToggle={handleHelpToggle}
          />
          {helpMode && <CursorFollower initialPosition={cursorPosition.current} />}
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
