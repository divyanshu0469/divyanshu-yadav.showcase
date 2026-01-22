import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type AnimationConfig = {
  x?: number;
  y?: number;
  yPercent?: number;
  xPercent?: number;
  opacity?: number;
  scale?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  skewX?: number;
  skewY?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
};

const AnimatedText = ({
  label,
  stroke,
  shadow,
  delay,
  duration,
  className,
  style,
  animationState,
  openAnimation,
  closeAnimation,
  noMask,
  ...rest
}: {
  label: string;
  stroke?: boolean;
  shadow?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  animationState?: boolean;
  openAnimation?: AnimationConfig;
  closeAnimation?: AnimationConfig;
  noMask?: boolean;
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useLayoutEffect(() => {
    if (!textRef.current) return;

    if (!splitRef.current) {
      const config: any = {
        type: "lines",
        linesClass: "line",
      };

      if (!noMask) {
        config.mask = "lines";
      }

      splitRef.current = SplitText.create(textRef.current, config);

      // Set initial state based on openAnimation
      if (openAnimation && splitRef.current) {
        const initialState: any = {};
        if (openAnimation.x !== undefined) initialState.x = openAnimation.x;
        if (openAnimation.y !== undefined) initialState.y = openAnimation.y;
        if (openAnimation.yPercent !== undefined)
          initialState.yPercent = openAnimation.yPercent;
        if (openAnimation.xPercent !== undefined)
          initialState.xPercent = openAnimation.xPercent;
        if (openAnimation.opacity !== undefined)
          initialState.opacity = openAnimation.opacity;
        if (openAnimation.scale !== undefined)
          initialState.scale = openAnimation.scale;
        if (openAnimation.rotate !== undefined)
          initialState.rotate = openAnimation.rotate;
        if (openAnimation.rotateX !== undefined)
          initialState.rotateX = openAnimation.rotateX;
        if (openAnimation.rotateY !== undefined)
          initialState.rotateY = openAnimation.rotateY;
        if (openAnimation.rotateZ !== undefined)
          initialState.rotateZ = openAnimation.rotateZ;
        if (openAnimation.skewX !== undefined)
          initialState.skewX = openAnimation.skewX;
        if (openAnimation.skewY !== undefined)
          initialState.skewY = openAnimation.skewY;

        gsap.set(splitRef.current.lines, initialState);
      }
    }

    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, [noMask, openAnimation]);

  useEffect(() => {
    if (animationState === undefined || !splitRef.current) return;

    if (animationState) {
      // Animate in
      if (!openAnimation) return;

      const fromState: any = {};
      const toState: any = {
        delay: openAnimation.delay ?? delay,
        duration: openAnimation.duration ?? duration,
        ease: openAnimation.ease ?? "power4.out",
        stagger: openAnimation.stagger ?? 0.075,
      };

      if (openAnimation.x !== undefined) {
        fromState.x = openAnimation.x;
        toState.x = 0;
      }
      if (openAnimation.y !== undefined) {
        fromState.y = openAnimation.y;
        toState.y = 0;
      }
      if (openAnimation.yPercent !== undefined) {
        fromState.yPercent = openAnimation.yPercent;
        toState.yPercent = 0;
      }
      if (openAnimation.xPercent !== undefined) {
        fromState.xPercent = openAnimation.xPercent;
        toState.xPercent = 0;
      }
      if (openAnimation.opacity !== undefined) {
        fromState.opacity = openAnimation.opacity;
        toState.opacity = 1;
      }
      if (openAnimation.scale !== undefined) {
        fromState.scale = openAnimation.scale;
        toState.scale = 1;
      }
      if (openAnimation.rotate !== undefined) {
        fromState.rotate = openAnimation.rotate;
        toState.rotate = 0;
      }
      if (openAnimation.rotateX !== undefined) {
        fromState.rotateX = openAnimation.rotateX;
        toState.rotateX = 0;
      }
      if (openAnimation.rotateY !== undefined) {
        fromState.rotateY = openAnimation.rotateY;
        toState.rotateY = 0;
      }
      if (openAnimation.rotateZ !== undefined) {
        fromState.rotateZ = openAnimation.rotateZ;
        toState.rotateZ = 0;
      }
      if (openAnimation.skewX !== undefined) {
        fromState.skewX = openAnimation.skewX;
        toState.skewX = 0;
      }
      if (openAnimation.skewY !== undefined) {
        fromState.skewY = openAnimation.skewY;
        toState.skewY = 0;
      }

      gsap.fromTo(splitRef.current.lines, fromState, toState);
    } else {
      // Animate out
      if (!closeAnimation) return;

      const toState: any = {
        delay: closeAnimation.delay ?? 0,
        duration: closeAnimation.duration ?? duration,
        ease: closeAnimation.ease ?? "power4.in",
        stagger: closeAnimation.stagger ?? 0.075,
      };

      if (closeAnimation.x !== undefined) {
        toState.x = closeAnimation.x;
      }
      if (closeAnimation.y !== undefined) {
        toState.y = closeAnimation.y;
      }
      if (closeAnimation.yPercent !== undefined) {
        toState.yPercent = closeAnimation.yPercent;
      }
      if (closeAnimation.xPercent !== undefined) {
        toState.xPercent = closeAnimation.xPercent;
      }
      if (closeAnimation.opacity !== undefined) {
        toState.opacity = closeAnimation.opacity;
      }
      if (closeAnimation.scale !== undefined) {
        toState.scale = closeAnimation.scale;
      }
      if (closeAnimation.rotate !== undefined) {
        toState.rotate = closeAnimation.rotate;
      }
      if (closeAnimation.rotateX !== undefined) {
        toState.rotateX = closeAnimation.rotateX;
      }
      if (closeAnimation.rotateY !== undefined) {
        toState.rotateY = closeAnimation.rotateY;
      }
      if (closeAnimation.rotateZ !== undefined) {
        toState.rotateZ = closeAnimation.rotateZ;
      }
      if (closeAnimation.skewX !== undefined) {
        toState.skewX = closeAnimation.skewX;
      }
      if (closeAnimation.skewY !== undefined) {
        toState.skewY = closeAnimation.skewY;
      }

      gsap.to(splitRef.current.lines, toState);
    }
  }, [animationState, delay, duration, openAnimation, closeAnimation]);

  return (
    <p
      ref={textRef}
      className={className}
      style={{
        WebkitTextStroke: stroke ? "0.3px black" : undefined,
        textShadow: shadow ? "-2px 2px 4px #751018" : undefined,
        ...style,
      }}
      {...rest}
    >
      {label}
    </p>
  );
};

export default AnimatedText;
