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
          label="this is the moment"
          duration={1.5}
          shadow
          animationState={startAnimation}
          openAnimation={{ yPercent: -100 }}
          className={styles.smallText}
        />
        <AnimatedText
          label="Let's make it"
          delay={0.7}
          duration={1.5}
          shadow
          animationState={startAnimation}
          openAnimation={{ yPercent: -100 }}
          className={styles.largeText}
        />
        <AnimatedText
          label="happen"
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
