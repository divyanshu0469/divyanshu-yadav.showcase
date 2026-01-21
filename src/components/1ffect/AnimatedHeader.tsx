"use client";
import AnimatedText from "./AnimatedText";
import styles from "./AnimatedHeader.module.css";

const AnimatedHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.innerContainer}>
        <AnimatedText
          label="this is the moment"
          duration={1.5}
          shadow
          animationState
          openAnimation={{ yPercent: -100 }}
          className={styles.smallText}
        />
        <AnimatedText
          label="Let's make it"
          delay={1}
          duration={1.5}
          shadow
          animationState
          openAnimation={{ yPercent: -100 }}
          className={styles.largeText}
        />
        <AnimatedText
          label="happen"
          delay={1}
          duration={1.5}
          shadow
          animationState
          openAnimation={{ yPercent: -100 }}
          className={styles.largeText}
        />
      </div>
    </div>
  );
};
export default AnimatedHeader;
