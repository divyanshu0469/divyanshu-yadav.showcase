import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "@/pages/1ffect/1ffect.module.css";

const IMAGE_PATHS = [
  "/1ffect/images/cb650r-1.webp",
  "/1ffect/images/cb650r-2.webp",
  "/1ffect/images/cb650r-3.webp",
];

export type ImageRevealHandle = {
  plusHRef: HTMLDivElement | null;
  revealImgRefs: (HTMLImageElement | null)[];
};

type ImageRevealProps = {
  activeModelIndex: number;
};

const ImageReveal = forwardRef<ImageRevealHandle, ImageRevealProps>(
  ({ activeModelIndex }, ref) => {
    const plusHRef = useRef<HTMLDivElement>(null);
    const revealImgRefs = useRef<(HTMLImageElement | null)[]>([
      null,
      null,
      null,
    ]);

    useImperativeHandle(ref, () => ({
      get plusHRef() {
        return plusHRef.current;
      },
      get revealImgRefs() {
        return revealImgRefs.current;
      },
    }));

    return (
      <div className={styles.revealContainer}>
        <div
          ref={plusHRef}
          className={styles.plusLine}
          style={{
            width: 0,
            height: "2px",
            backgroundColor:
              activeModelIndex === 0
                ? "var(--color-fg)"
                : "var(--color-accent)",
          }}
        />
        <div className={styles.revealImageStack}>
          {IMAGE_PATHS.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              ref={(el) => {
                revealImgRefs.current[i] = el;
              }}
              src={src}
              alt={`Honda CB650R ${i + 1}`}
              className={styles.revealImage}
              style={{ opacity: 0 }}
            />
          ))}
        </div>
      </div>
    );
  },
);

ImageReveal.displayName = "ImageReveal";

export default ImageReveal;
