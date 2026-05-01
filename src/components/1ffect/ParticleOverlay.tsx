import AnimatedText from "./AnimatedText";
import styles from "@/pages/1ffect/1ffect.module.css";

const OPEN_ANIM_DOWN = { yPercent: -100 };

const FEATURES = [
  { label: "649cc Inline-Four Engine", delay: 0.3 },
  { label: "Neo Sports Café Design", delay: 0.5 },
  { label: "Showa SFF-BP Inverted Forks", delay: 0.7 },
  { label: "Full-Color TFT Display", delay: 0.9 },
  { label: "Lightweight & Agile", delay: 1.1 },
];

type ParticleOverlayProps = {
  activeModelIndex: number;
  particleTextVisible: boolean;
};

const ParticleOverlay = ({
  activeModelIndex,
  particleTextVisible,
}: ParticleOverlayProps) => {
  return (
    <div
      className={styles.particleOverlay}
      style={
        {
          "--text-color":
            activeModelIndex === 0
              ? "var(--effect1-color-fg)"
              : "var(--effect1-color-accent)",
          "--text-hover-color":
            activeModelIndex === 0
              ? "var(--effect1-color-accent)"
              : "var(--effect1-color-bg)",
        } as React.CSSProperties
      }
    >
      <AnimatedText
        label="Honda"
        duration={1.5}
        animationState={particleTextVisible}
        openAnimation={OPEN_ANIM_DOWN}
        className={styles.particleTitle}
      />
      <AnimatedText
        label="CB650R"
        delay={0.1}
        duration={1.5}
        animationState={particleTextVisible}
        openAnimation={OPEN_ANIM_DOWN}
        className={styles.particleTitle}
      />
      <div className={styles.particleFeatures}>
        {FEATURES.map((feat) => (
          <AnimatedText
            key={feat.label}
            label={feat.label}
            delay={feat.delay}
            duration={1.5}
            animationState={particleTextVisible}
            openAnimation={OPEN_ANIM_DOWN}
            className={styles.particleFeature}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleOverlay;
