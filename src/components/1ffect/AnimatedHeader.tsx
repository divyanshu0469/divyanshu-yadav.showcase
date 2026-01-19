"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import styles from "./AnimatedHeader.module.css";

gsap.registerPlugin(SplitText);

const AnimatedText = ({
  label,
  stroke,
  shadow,
  delay,
  duration,
  className,
}: {
  label: string;
  stroke?: boolean;
  shadow?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = SplitText.create(textRef.current, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    gsap.fromTo(
      split.lines,
      { yPercent: -100 },
      {
        yPercent: 0,
        delay: delay,
        duration: duration,
        ease: "power4.out",
        stagger: 0.075,
      }
    );

    return () => split.revert();
  }, []);

  return (
    <p
      ref={textRef}
      className={className}
      style={{
        WebkitTextStroke: stroke ? "0.3px black" : undefined,
        textShadow: shadow ? "-2px 2px 4px #751018" : undefined,
      }}
    >
      {label}
    </p>
  );
};

const AnimatedHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.innerContainer}>
        <AnimatedText
          label="this is the moment"
          duration={1.5}
          shadow
          className={styles.smallText}
        />
        <AnimatedText
          label="Let's make it"
          delay={1}
          duration={1.5}
          shadow
          className={styles.largeText}
        />
        <AnimatedText
          label="happen"
          delay={1}
          duration={1.5}
          shadow
          className={styles.largeText}
        />
      </div>
    </div>
  );
};
export default AnimatedHeader;
