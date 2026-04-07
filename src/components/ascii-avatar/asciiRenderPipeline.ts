import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D tScene;
  uniform sampler2D tCharAtlas;
  uniform vec2 uResolution;
  uniform float uGranularity;
  uniform float uCharCount;
  uniform float uTime;

  // Theme colors: cyan, purple, green
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec2 vUv;

  // Pseudo-random for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Pixelate: snap to grid cell
    vec2 cellSize = vec2(uGranularity) / uResolution;
    vec2 cellUV = cellSize * (floor(vUv / cellSize) + 0.5);

    // Sample scene at cell center
    vec4 sceneColor = texture2D(tScene, cellUV);
    float lum = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));

    // Discard near-black cells (background)
    if (lum < 0.018) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    // Map luminance directly to character index — no randomization
    float charIndex = floor(lum * (uCharCount - 1.0) + 0.5);
    charIndex = clamp(charIndex, 0.0, uCharCount - 1.0);

    // Atlas lookup: 16x16 grid
    float col = mod(charIndex, 16.0);
    float row = floor(charIndex / 16.0);

    // Position within the current grid cell [0, 1]
    vec2 subUV = fract(vUv / cellSize);

    // Atlas UV
    vec2 atlasUV = (vec2(col, row) + subUV) / 16.0;
    atlasUV.y = 1.0 - atlasUV.y;

    float charAlpha = texture2D(tCharAtlas, atlasUV).r;

    // === THEME COLOR GRADIENT ===
    // Tri-color gradient based on screen position + normal direction
    // Vertical gradient: cyan (top) → purple (middle) → green (bottom)
    float t = vUv.y;
    vec3 themeColor;
    if (t > 0.5) {
      themeColor = mix(uColorB, uColorA, (t - 0.5) * 2.0);
    } else {
      themeColor = mix(uColorC, uColorB, t * 2.0);
    }

    // Mix in some color variation from the scene normals
    vec3 normalColor = sceneColor.rgb;
    themeColor = mix(themeColor, normalColor * 0.5 + themeColor * 0.5, 0.3);

    // Apply character glyph with luminance-based intensity (dimmer overall)
    float intensity = charAlpha * (0.5 + lum * 0.85);
    vec3 color = themeColor * intensity;

    // Subtle glow on brighter characters (reduced)
    float glow = smoothstep(0.5, 1.0, lum) * charAlpha * 0.08;
    color += themeColor * glow;

    // Subtle noise flicker (like a CRT)
    float noise = hash(cellUV * 100.0 + uTime * 0.5);
    color *= 0.93 + noise * 0.07;

    // Slight scanline darkening on every other row for CRT feel
    float scanline = 1.0 - smoothstep(0.4, 0.6, fract(vUv.y * uResolution.y / uGranularity * 0.5)) * 0.08;
    color *= scanline;

    gl_FragColor = vec4(color, charAlpha * clamp(lum * 2.5, 0.0, 1.0));
  }
`;

export function createAsciiPipeline(
  renderer: THREE.WebGLRenderer,
  charAtlasCanvas: HTMLCanvasElement,
  charCount: number
) {
  const size = renderer.getSize(new THREE.Vector2());

  const renderTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
  });

  const charAtlasTexture = new THREE.CanvasTexture(charAtlasCanvas);
  charAtlasTexture.minFilter = THREE.NearestFilter;
  charAtlasTexture.magFilter = THREE.NearestFilter;

  const asciiMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      tScene: { value: renderTarget.texture },
      tCharAtlas: { value: charAtlasTexture },
      uResolution: { value: new THREE.Vector2(size.x, size.y) },
      uGranularity: { value: 6.0 },
      uCharCount: { value: charCount },
      uTime: { value: 0 },
      // Varied whites for visible shading across the avatar
      uColorA: { value: new THREE.Color(0xd8dce0) }, // bright cool white (highlights)
      uColorB: { value: new THREE.Color(0x8890a0) }, // darker blue-gray (shadows/mid)
      uColorC: { value: new THREE.Color(0xc0c8c0) }, // soft warm white (base)
    },
    transparent: true,
    depthTest: false,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), asciiMaterial);

  const asciiScene = new THREE.Scene();
  asciiScene.add(quad);

  const asciiCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function resize(width: number, height: number) {
    renderTarget.setSize(width, height);
    asciiMaterial.uniforms.uResolution.value.set(width, height);
  }

  function updateTime(time: number) {
    asciiMaterial.uniforms.uTime.value = time;
  }

  function dispose() {
    renderTarget.dispose();
    charAtlasTexture.dispose();
    asciiMaterial.dispose();
    quad.geometry.dispose();
  }

  return {
    renderTarget,
    asciiScene,
    asciiCamera,
    asciiMaterial,
    resize,
    updateTime,
    dispose,
  };
}
