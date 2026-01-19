import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ToolBar.module.css";

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
};

const ToolBar = ({
  position,
  strokeWidth = 2,
  foreground = "red",
  background = "black",
}: ToolBarProps) => {
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
    gsap.set(box1Ref.current, {
      borderTopColor: foreground,
      borderRightColor: foreground,
    });
    gsap.set(box2Ref.current, {
      borderBottomColor: foreground,
      borderLeftColor: foreground,
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
        ease: "cubic-bezier(0.83, 0, 0.17, 1);",
      });
      gsap.to(box1Ref.current, {
        borderTopColor: background,
        borderRightColor: background,
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(box2Ref.current, {
        borderBottomColor: background,
        borderLeftColor: background,
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
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
        ease: "cubic-bezier(0.83, 0, 0.17, 1);",
      });
      gsap.to(box1Ref.current, {
        borderTopColor: foreground,
        borderRightColor: foreground,
        duration: 0.3,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      gsap.to(box2Ref.current, {
        borderBottomColor: foreground,
        borderLeftColor: foreground,
        duration: 0.3,
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
      }}
      onMouseEnter={open ? undefined : handleMouseEnter}
      onMouseLeave={open ? undefined : handleMouseLeave}
      onClick={handleClick}
    >
      {/* <div
        ref={menuRef}
        style={{
          bottom: 0,
          right: 0,
          zIndex: 0,
          position: "absolute",
          borderRadius: "2px",
          backgroundColor: foreground,
          transformOrigin: "bottom center",
        }}
        className={styles.box}
      ></div> */}
      <div
        ref={buttonBackgroundRef}
        style={{
          zIndex: 0,
          position: "absolute",
          borderRadius: "2px",
          backgroundColor: foreground,
          transformOrigin: "bottom center",
        }}
        className={styles.box}
      ></div>
      <div style={{ justifyContent: "end" }} className={styles.container}>
        <div ref={boxWrapper1Ref} className={styles.boxWrapper}>
          <div
            ref={box1Ref}
            style={{
              borderTop: `${strokeWidth}px solid`,
              borderRight: `${strokeWidth}px solid`,
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
              borderBottom: `${strokeWidth}px solid`,
              borderLeft: `${strokeWidth}px solid`,
            }}
            className={styles.box}
          ></div>
        </div>
      </div>
    </button>
  );
};

export default ToolBar;
