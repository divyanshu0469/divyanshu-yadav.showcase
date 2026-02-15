export const vertexShader = /* glsl */ `
  attribute vec3 aRandom;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uScale;
  uniform float uPointSize;

  void main() {
    vPosition = position;
    float time = uTime * 4.0;

    vec3 pos = position;
    pos.x += sin(time * aRandom.x) * 0.01;
    pos.y += cos(time * aRandom.y) * 0.01;
    pos.z += cos(time * aRandom.x) * 0.01;

    pos.x *= uScale + (sin(pos.y * 4.0 + time) * (1.0 - uScale));
    pos.y *= uScale + (cos(pos.z * 4.0 + time) * (1.0 - uScale));
    pos.z *= uScale + (sin(pos.x * 4.0 + time) * (1.0 - uScale));

    pos *= uScale;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uPointSize / -mvPosition.z;
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3 vPosition;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;

  void main() {
    float depth = vPosition.z * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, depth);
    gl_FragColor = vec4(color, depth * uOpacity + 0.2);
  }
`;
