import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./ParticleScene.module.css";

export interface ModelDefinition {
  name: string;
  file: string;
  color1: string;
  color2: string;
  background: string;
  pointSize: number;
  opacity?: number;
  placeOnLoad?: boolean;
}

export interface ParticleSceneHandle {
  toggleModel: () => void;
}

interface ParticleSceneProps {
  models: ModelDefinition[];
  handleRef?: React.RefObject<ParticleSceneHandle | null>;
}

function createGrainTexture(): string {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 18;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

const ParticleScene = ({ models: modelConfigs, handleRef }: ParticleSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const toggleRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const grainEl = grainRef.current;
    if (!container || !canvas || !grainEl) return;

    let cleanup: (() => void) | undefined;

    const initScene = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      // Lightweight grain: generate once, animate with CSS
      grainEl.style.backgroundImage = `url(${createGrainTexture()})`;

      const THREE = await import("three");
      const { ParticleModel } = await import("./ParticleModel");

      const rect = container.getBoundingClientRect();

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        rect.width / rect.height,
        0.1,
        100,
      );
      camera.position.set(3, 0, 1);
      camera.lookAt(0, 0, 0);

      const clock = new THREE.Clock();

      const handleBgChange = (color: string) => {
        gsap.to(container, {
          backgroundColor: color,
          duration: 0.8,
        });
      };

      const modelInstances = modelConfigs.map(
        (config) =>
          new ParticleModel({ ...config, scene }, handleBgChange),
      );

      let activeIndex = 0;

      const handleClick = () => {
        modelInstances[activeIndex].remove();
        activeIndex = (activeIndex + 1) % modelInstances.length;
        modelInstances[activeIndex].add();
      };
      toggleRef.current = handleClick;
      if (handleRef) {
        (handleRef as React.MutableRefObject<ParticleSceneHandle | null>).current = { toggleModel: handleClick };
      }


      const handleMouseMove = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        gsap.to(scene.rotation, {
          y: gsap.utils.mapRange(0, r.width, 0.2, -0.2, x),
          x: gsap.utils.mapRange(0, r.height, 0.2, -0.2, y),
        });
      };
      canvas.addEventListener("mousemove", handleMouseMove);

      const handleResize = () => {
        const r = container.getBoundingClientRect();
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r.width, r.height);
      };
      window.addEventListener("resize", handleResize);

      let frameId: number;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        for (const model of modelInstances) {
          if (model.isActive && model.particleMaterial) {
            model.particleMaterial.uniforms.uTime.value = elapsed;
          }
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(frameId);
        canvas.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);

        for (const model of modelInstances) {
          model.dispose();
        }

        renderer.dispose();
        scene.clear();
        isInitializedRef.current = false;
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isInitializedRef.current) {
          initScene();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [modelConfigs]);

  return (
    <section
      ref={containerRef}
      className={styles.section}
      style={{ backgroundColor: modelConfigs[0]?.background ?? "#000" }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={grainRef} className={styles.grain} />
    </section>
  );
};

export default ParticleScene;
