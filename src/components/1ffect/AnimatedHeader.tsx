"use client";
import AnimatedText from "./AnimatedText";
import styles from "./AnimatedHeader.module.css";

type AnimatedHeaderProps = {
  startAnimation?: boolean;
};

const AnimatedHeader = ({ startAnimation = true }: AnimatedHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.innerContainer}>
        <AnimatedText
          label="not just a ride"
          duration={1.5}
          shadow
          animationState={startAnimation}
          openAnimation={{ yPercent: -100 }}
          className={styles.smallText}
        />
        <AnimatedText
          label="this machine is a"
          delay={0.7}
          duration={1.5}
          shadow
          animationState={startAnimation}
          openAnimation={{ yPercent: -100 }}
          className={styles.largeText}
        />
        <AnimatedText
          label="statement"
          delay={0.7}
          duration={1.5}
          shadow
          animationState={startAnimation}
          openAnimation={{ yPercent: -100 }}
          className={styles.largeText}
        />
      </div>
    </div>
  );
};
export default AnimatedHeader;
