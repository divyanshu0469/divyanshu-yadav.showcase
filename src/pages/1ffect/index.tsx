import { useState, useEffect, useRef, ReactElement } from "react";
import { Anton, Inter } from "next/font/google";
import gsap from "gsap";
import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import Preloader from "@/components/1ffect/Preloader";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";
import type { NextPageWithLayout } from "@/pages/_app";

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
        backgroundColor: "var(--foreground)",
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorPosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePreloaderComplete = () => {
    setAnimationsStarted(true);
  };

  const handleHelpToggle = () => {
    setHelpMode((v) => !v);
  };

  return (
    <div className={styles.container}>
      <Preloader onComplete={handlePreloaderComplete} />
      <AnimatedRedLines
        className={styles.redLines}
        startAnimation={animationsStarted}
      />
      <AnimatedHeader startAnimation={animationsStarted} />
      <ToolBar
        foreground="var(--foreground)"
        position={{ bottom: "2rem", right: "2rem" }}
        onHelpToggle={handleHelpToggle}
      />
      {helpMode && <CursorFollower initialPosition={cursorPosition.current} />}
    </div>
  );
};

Effect1.getLayout = (page: ReactElement) => {
  return (
    <div className={`${anton.variable} ${inter.variable}`}>
      {page}
    </div>
  );
};

export default Effect1;
