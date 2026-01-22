"use client";
import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  onComplete: () => void;
};

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const curveRef = useRef<SVGPathElement>(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    if (
      !preloaderRef.current ||
      !numberRef.current ||
      !wrapperRef.current ||
      !curveRef.current
    )
      return;

    const counterObj = { value: 0 };
    const curveObj = { curve: 0 };

    gsap.set(numberRef.current, { yPercent: 100 });

    const easeCounter = "M0,0 C0.83,0 0.17,1 1,1";
    const easeExit = "M0,0 C0.37,0 0.63,1 1,1";

    const tl = gsap.timeline();

    tl.to(numberRef.current, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .to(
        counterObj,
        {
          value: 100,
          duration: 3,
          ease: easeCounter,
          snap: { value: 1 },
          onUpdate: () => setCount(Math.round(counterObj.value)),
        },
        "count"
      )
      .to(
        wrapperRef.current,
        {
          scale: 1.2,
          duration: 3,
          ease: easeCounter,
        },
        "count"
      )
      .to(numberRef.current, {
        yPercent: -100,
        duration: 0.6,
        ease: "power3.in",
      })
      .to(
        curveObj,
        {
          curve: 50,
          duration: 1.2,
          ease: easeExit,
          onUpdate: () => {
            const c = curveObj.curve;
            curveRef.current?.setAttribute(
              "d",
              `M 0 ${c} Q 50 0 100 ${c} L 100 100 L 0 100 Z`
            );
          },
        },
        "exit"
      )
      .to(
        preloaderRef.current,
        {
          yPercent: 100,
          duration: 1.2,
          ease: easeExit,
          onComplete,
        },
        "exit"
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <>
      <svg className={styles.clipSvg}>
        <defs>
          <clipPath id="preloader-clip" clipPathUnits="objectBoundingBox">
            <path
              ref={curveRef}
              d="M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z"
              transform="scale(0.01)"
            />
          </clipPath>
        </defs>
      </svg>
      <div ref={preloaderRef} className={styles.preloader}>
        <div ref={wrapperRef} className={styles.numberWrapper}>
          <span ref={numberRef} className={styles.number}>
            {count}
          </span>
        </div>
      </div>
    </>
  );
};

export default Preloader;
