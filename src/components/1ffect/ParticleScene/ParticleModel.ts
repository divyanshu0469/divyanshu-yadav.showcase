import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import gsap from "gsap";
import { vertexShader, fragmentShader } from "./shaders";

const NUM_PARTICLES = 20000;
const DRACO_PATH = "/1ffect/draco/";

export interface ModelConfig {
  name: string;
  file: string;
  scene: THREE.Scene;
  color1: string;
  color2: string;
  background: string;
  pointSize: number;
  opacity?: number;
  placeOnLoad?: boolean;
}

export class ParticleModel {
  isActive = false;
  particleMaterial!: THREE.ShaderMaterial;

  private name: string;
  private scene: THREE.Scene;
  private background: string;
  private placeOnLoad: boolean;
  private particles!: THREE.Points;
  private particlesGeometry!: THREE.BufferGeometry;
  private loader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private onBackgroundChange?: (color: string) => void;

  constructor(
    config: ModelConfig,
    onBackgroundChange?: (color: string) => void,
  ) {
    this.name = config.name;
    this.scene = config.scene;
    this.background = config.background;
    this.placeOnLoad = config.placeOnLoad ?? false;
    this.onBackgroundChange = onBackgroundChange;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(DRACO_PATH);
    this.loader.setDRACOLoader(this.dracoLoader);

    this.init(config);
  }

  private init(config: ModelConfig): void {
    this.loader.load(config.file, (gltf) => {
      const mesh = gltf.scene.children[0] as THREE.Mesh;

      this.particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color(config.color1) },
          uColor2: { value: new THREE.Color(config.color2) },
          uTime: { value: 0 },
          uScale: { value: 0 },
          uPointSize: { value: config.pointSize },
          uOpacity: { value: config.opacity ?? 0.1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const sampler = new MeshSurfaceSampler(mesh).build();
      this.particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(NUM_PARTICLES * 3);
      const randomness = new Float32Array(NUM_PARTICLES * 3);
      const point = new THREE.Vector3();

      for (let i = 0; i < NUM_PARTICLES; i++) {
        sampler.sample(point);
        positions.set([point.x, point.y, point.z], i * 3);
        randomness.set(
          [
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
          ],
          i * 3,
        );
      }

      this.particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      this.particlesGeometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(randomness, 3),
      );

      this.particles = new THREE.Points(
        this.particlesGeometry,
        this.particleMaterial,
      );

      if (this.placeOnLoad) {
        this.add();
      }
    });
  }

  add(): void {
    if (!this.particles) return;
    this.scene.add(this.particles);

    gsap.to(this.particleMaterial.uniforms.uScale, {
      value: 1,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out",
    });

    if (!this.isActive) {
      gsap.fromTo(
        this.particles.rotation,
        { y: Math.PI },
        { y: 0, duration: 0.8, ease: "power3.out" },
      );
      this.onBackgroundChange?.(this.background);
    }

    this.isActive = true;
  }

  remove(): void {
    if (!this.particles || !this.isActive) return;

    gsap.to(this.particleMaterial.uniforms.uScale, {
      value: 0,
      duration: 0.8,
      ease: "power3.out",
      onComplete: () => {
        this.scene.remove(this.particles);
        this.isActive = false;
      },
    });

    gsap.to(this.particles.rotation, {
      y: Math.PI,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  dispose(): void {
    if (this.particles) {
      this.scene.remove(this.particles);
    }
    this.particlesGeometry?.dispose();
    this.particleMaterial?.dispose();
    this.dracoLoader.dispose();
  }
}
