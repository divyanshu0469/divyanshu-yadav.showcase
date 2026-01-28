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
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (
      !preloaderRef.current ||
      !numberRef.current ||
      !wrapperRef.current
    )
      return;

    const counterObj = { value: 0 };
    const heightObj = { value: 100 };
    const wrapperHeight = wrapperRef.current.offsetHeight * 1.2;
    const targetHeightVh = (wrapperHeight / window.innerHeight) * 100;

    gsap.set(numberRef.current, { yPercent: 100 });

    const easeCounter = "M0,0 C0.83,0 0.17,1 1,1";

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
      .to(
        heightObj,
        {
          value: targetHeightVh,
          duration: 3,
          ease: easeCounter,
          onUpdate: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.height = `${heightObj.value}vh`;
            }
          },
        },
        "count"
      )
      .to(numberRef.current, {
        yPercent: -100,
        duration: 0.6,
        ease: "power3.in",
      })
      .to(heightObj, {
        value: 0,
        duration: 0.6,
        ease: easeCounter,
        onUpdate: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.height = `${heightObj.value}vh`;
          }
        },
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={preloaderRef} className={styles.preloader}>
      <div ref={wrapperRef} className={styles.numberWrapper}>
        <span ref={numberRef} className={styles.number}>
          {count}
        </span>
      </div>
    </div>
  );
};

export default Preloader;
