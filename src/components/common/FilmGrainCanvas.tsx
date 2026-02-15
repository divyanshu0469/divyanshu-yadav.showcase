import { useEffect, useRef } from "react";

const FilmGrainCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with film grain
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      #define SPEED 2.0
      #define INTENSITY 0.075
      #define MEAN 0.0
      #define VARIANCE 0.5

      float gaussian(float z, float u, float o) {
        return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
      }

      void main() {
        vec2 coord = gl_FragCoord.xy;
        vec2 ps = vec2(1.0) / iResolution.xy;
        vec2 uv = coord * ps;

        float t = iTime * float(SPEED);
        float seed = dot(uv, vec2(12.9898, 78.233));
        float noise = fract(sin(seed) * 43758.5453 + t);
        noise = gaussian(noise, float(MEAN), float(VARIANCE) * float(VARIANCE));

        // Center the noise around 0.5 and scale
        float grain = (noise - 0.5) * float(INTENSITY) * 2.0;

        // Output grain that will blend with background
        gl_FragColor = vec4(grain, grain, grain, 0.5);
      }
    `;

    // Compile shader
    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Enable blending for transparency with additive blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    // Create buffer for full-screen quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");

    // Resize canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    const startTime = Date.now();
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(iTimeLocation, currentTime);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
};

export default FilmGrainCanvas;
