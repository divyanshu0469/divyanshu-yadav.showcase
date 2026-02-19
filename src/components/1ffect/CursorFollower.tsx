import { useEffect, useRef } from "react";
import gsap from "gsap";

type CursorFollowerProps = {
  initialPosition: { x: number; y: number };
};

const CursorFollower = ({ initialPosition }: CursorFollowerProps) => {
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
        zIndex: 40,
        animation: "blink 1.5s ease-in-out infinite",
      }}
    />
  );
};

export default CursorFollower;
