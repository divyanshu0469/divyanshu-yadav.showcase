import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "@/pages/1ffect/1ffect.module.css";

type ParticleLinesProps = {
  activeModelIndex: number;
  activeLineIndex: number | null;
  onLineClick: (idx: number) => void;
};

export type ParticleLinesHandle = {
  lineRefs: (HTMLDivElement | null)[];
  lineNumberRefs: (HTMLSpanElement | null)[];
};

const ParticleLines = forwardRef<ParticleLinesHandle, ParticleLinesProps>(
  ({ activeModelIndex, activeLineIndex, onLineClick }, ref) => {
    const lineRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
    const lineNumberRefs = useRef<(HTMLSpanElement | null)[]>([
      null,
      null,
      null,
    ]);

    useImperativeHandle(ref, () => ({
      get lineRefs() {
        return lineRefs.current;
      },
      get lineNumberRefs() {
        return lineNumberRefs.current;
      },
    }));

    return (
      <div className={styles.particleLines}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className={`${styles.particleLine}${activeLineIndex === i ? ` ${styles.particleLineActive}` : ""}`}
            onClick={() => onLineClick(i)}
            style={
              {
                backgroundColor:
                  activeModelIndex === 0
                    ? "var(--color-fg)"
                    : "var(--color-accent)",
                "--line-border-color":
                  activeModelIndex === 0
                    ? "var(--color-accent)"
                    : "var(--color-bg)",
                "--line-text-color":
                  activeModelIndex === 0
                    ? "var(--color-bg)"
                    : "var(--color-fg)",
                "--line-text-hover":
                  activeModelIndex === 0
                    ? "var(--color-accent)"
                    : "var(--color-bg)",
              } as React.CSSProperties
            }
          >
            <span
              ref={(el) => {
                lineNumberRefs.current[i] = el;
              }}
              className={styles.particleLineNumber}
            >
              N<sup>o</sup>
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    );
  },
);

ParticleLines.displayName = "ParticleLines";

export default ParticleLines;
