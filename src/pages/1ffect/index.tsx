import { useState } from "react";
import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import Preloader from "@/components/1ffect/Preloader";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";

export default function Effect1() {
  const [animationsStarted, setAnimationsStarted] = useState(false);

  const handlePreloaderComplete = () => {
    setAnimationsStarted(true);
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
      />
    </div>
  );
}
