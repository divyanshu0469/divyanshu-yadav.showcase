import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import styles from "./ToolBar.module.css";

// Register the plugin
gsap.registerPlugin(CustomEase);

// Create spring easing with overshoot and settle
// This curve overshoots to ~1.1, then settles back to 1
CustomEase.create(
  "spring",
  "M0,0 C0.2,0 0.3,1.2 0.5,1.1 0.7,1.05 0.85,0.98 1,1",
);

type ToolBarProps = {
  position: {
    left?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
  };
  strokeWidth?: number;
  foreground?: string;
  background?: string;
  onHelpToggle?: () => void;
};

const ToolBar = ({
  position,
  strokeWidth = 2,
  foreground = "var(--color-fg)",
  background = "var(--color-bg)",
  onHelpToggle,
}: ToolBarProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonBackgroundRef = useRef<HTMLDivElement>(null);
  const boxWrapper1Ref = useRef<HTMLDivElement>(null);
  const boxWrapper2Ref = useRef<HTMLDivElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.set(boxWrapper1Ref.current, {
      paddingTop: "0.5rem",
      paddingRight: "0.5rem",
    });
    gsap.set(boxWrapper2Ref.current, {
      paddingBottom: "0.5rem",
      paddingLeft: "0.5rem",
    });
    gsap.set(buttonBackgroundRef.current, {
      rotateX: 90,
    });
    gsap.set(menuRef.current, {
      rotateX: 90,
    });
  }, []);

  useEffect(() => {
    if (open) {
      gsap.to(boxWrapper1Ref.current, {
        paddingTop: 0,
        paddingRight: 0,
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(boxWrapper2Ref.current, {
        paddingBottom: 0,
        paddingLeft: 0,
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(box1Ref.current, {
        marginTop: -(strokeWidth || 0),
        marginRight: -(strokeWidth || 0),
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(box2Ref.current, {
        marginBottom: -(strokeWidth || 0),
        marginLeft: -(strokeWidth || 0),
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(boxWrapper1Ref.current, {
        transformOrigin: "top right",
        rotate: "45deg",
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(boxWrapper2Ref.current, {
        transformOrigin: "bottom left",
        rotate: "45deg",
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(buttonBackgroundRef.current, {
        rotateX: 0,
        duration: 0.3,
        ease: "cubic-bezier(0.83, 0, 0.17, 1)",
      });
      gsap.to(menuRef.current, {
        rotateX: 0,
        duration: 0.4,
        ease: "cubic-bezier(0.83, 0, 0.17, 1)",
      });
    } else {
      gsap.to(boxWrapper1Ref.current, {
        transformOrigin: "top right",
        rotate: "0deg",
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(boxWrapper2Ref.current, {
        transformOrigin: "bottom left",
        rotate: "0deg",
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(buttonBackgroundRef.current, {
        rotateX: 90,
        duration: 0.3,
        delay: 0.2,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(menuRef.current, {
        rotateX: 90,
        duration: 0.4,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
    }
  }, [open, strokeWidth]);

  const handleClick = () => {
    setOpen((v) => !v);
  };

  const handleMouseEnter = () => {
    gsap.to(boxWrapper1Ref.current, {
      paddingTop: 0,
      paddingRight: 0,
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    gsap.to(boxWrapper2Ref.current, {
      paddingBottom: 0,
      paddingLeft: 0,
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    gsap.to(box1Ref.current, {
      marginTop: -(strokeWidth || 0),
      marginRight: -(strokeWidth || 0),
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    gsap.to(box2Ref.current, {
      marginBottom: -(strokeWidth || 0),
      marginLeft: -(strokeWidth || 0),
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(boxWrapper1Ref.current, {
      paddingTop: "0.5rem",
      paddingRight: "0.5rem",
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    gsap.to(boxWrapper2Ref.current, {
      paddingBottom: "0.5rem",
      paddingLeft: "0.5rem",
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    gsap.to(box1Ref.current, {
      marginTop: 0,
      marginRight: 0,
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    gsap.to(box2Ref.current, {
      marginBottom: 0,
      marginLeft: 0,
      duration: 0.3,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };

  return (
    <button
      className={styles.button}
      style={{
        left: position.left,
        top: position.top,
        right: position.right,
        bottom: position.bottom,
        backgroundColor: background,
      }}
      onMouseEnter={open ? undefined : handleMouseEnter}
      onMouseLeave={open ? undefined : handleMouseLeave}
    >
      <div
        ref={menuRef}
        style={{
          bottom: 0,
          right: 0,
          zIndex: 0,
          height: "fit-content",
          position: "absolute",
          borderRadius: "2px",
          color: "var(--color-accent)",
          backgroundColor: "var(--color-fg)",
          transformOrigin: "bottom",
        }}
        className={styles.box}
      >
        <div
          style={{
            width: "100%",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onHelpToggle?.();
            }}
            style={{
              fontFamily: "Inter",
              fontWeight: 200,
              fontSize: "3.5rem",
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          >
            ?
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push("/");
            }}
            style={{
              fontFamily: "Inter",
              fontWeight: 200,
              fontSize: "3.5rem",
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          >
            {`<`}
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontWeight: 200,
              fontSize: "3.5rem",
              width: "100%",
              height: "100%",
              color: "transparent",
            }}
          >
            X
          </div>
        </div>
      </div>
      <div
        ref={buttonBackgroundRef}
        style={{
          zIndex: 0,
          position: "absolute",
          borderRadius: "2px",
          backgroundColor: "var(--color-accent)",
          transformOrigin: "bottom",
        }}
        className={styles.box}
      ></div>

      <div style={{ justifyContent: "end" }} className={styles.container}>
        <div ref={boxWrapper1Ref} className={styles.boxWrapper}>
          <div
            ref={box1Ref}
            style={{
              borderTop: `${strokeWidth}px solid ${foreground}`,
              borderRight: `${strokeWidth}px solid ${foreground}`,
            }}
            className={styles.box}
          ></div>
        </div>
      </div>
      <div className={styles.container}>
        <div ref={boxWrapper2Ref} className={styles.boxWrapper}>
          <div
            ref={box2Ref}
            style={{
              borderBottom: `${strokeWidth}px solid ${foreground}`,
              borderLeft: `${strokeWidth}px solid ${foreground}`,
            }}
            className={styles.box}
          ></div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className={styles.box}
        style={{
          position: "absolute",
          zIndex: 1,
          cursor: "pointer",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      ></div>
    </button>
  );
};

export default ToolBar;
