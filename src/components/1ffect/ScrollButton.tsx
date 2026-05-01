import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "@/pages/1ffect/1ffect.module.css";

export type ScrollButtonHandle = {
  buttonRef: HTMLButtonElement | null;
  arrowHeadLeftRef: SVGLineElement | null;
  arrowHeadRightRef: SVGLineElement | null;
  arrowShaftRef: SVGLineElement | null;
  knobRef: HTMLDivElement | null;
};

type ScrollButtonProps = {
  onClick: () => void;
};

const ScrollButton = forwardRef<ScrollButtonHandle, ScrollButtonProps>(
  ({ onClick }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const arrowHeadLeftRef = useRef<SVGLineElement>(null);
    const arrowHeadRightRef = useRef<SVGLineElement>(null);
    const arrowShaftRef = useRef<SVGLineElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      get buttonRef() {
        return buttonRef.current;
      },
      get arrowHeadLeftRef() {
        return arrowHeadLeftRef.current;
      },
      get arrowHeadRightRef() {
        return arrowHeadRightRef.current;
      },
      get arrowShaftRef() {
        return arrowShaftRef.current;
      },
      get knobRef() {
        return knobRef.current;
      },
    }));

    return (
      <button
        ref={buttonRef}
        className={styles.scrollButton}
        onClick={onClick}
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
            stroke="var(--effect1-color-accent)"
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
            stroke="var(--effect1-color-accent)"
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
            stroke="var(--effect1-color-accent)"
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div ref={knobRef} className={styles.toggleKnob} />
      </button>
    );
  },
);

ScrollButton.displayName = "ScrollButton";

export default ScrollButton;
