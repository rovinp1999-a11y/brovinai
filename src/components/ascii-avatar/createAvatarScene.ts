import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(min: number, max: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
}

export async function createAvatarScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  const normalMat = new THREE.MeshNormalMaterial({ flatShading: false });

  // ===========================
  // LOAD MODEL
  // ===========================
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync("/models/human.glb");
  const model = gltf.scene;

  // Apply MeshNormalMaterial to all meshes for the ASCII shader
  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = normalMat;
    }
  });

  // Scale and position the model
  model.scale.setScalar(0.45);
  model.position.set(0, 0, 0);

  const modelGroup = new THREE.Group();
  modelGroup.add(model);
  scene.add(modelGroup);

  // ===========================
  // ANIMATION MIXER
  // ===========================
  const mixer = new THREE.AnimationMixer(model);
  const clock = new THREE.Clock();

  // Strip position tracks from all clips to prevent root motion jumping.
  // We control the model position manually — only keep rotation/scale tracks.
  for (const clip of gltf.animations) {
    clip.tracks = clip.tracks.filter(
      (track) => !track.name.endsWith(".position")
    );
  }

  const animations: Record<string, THREE.AnimationClip> = {};
  for (const clip of gltf.animations) {
    animations[clip.name] = clip;
  }

  // Create actions for each needed animation
  const actions: Record<string, THREE.AnimationAction> = {};
  const animNames = ["Sitting", "Idle", "Walking", "Wave", "Standing", "ThumbsUp"];
  for (const name of animNames) {
    if (animations[name]) {
      actions[name] = mixer.clipAction(animations[name]);
      actions[name].clampWhenFinished = true;
      actions[name].setLoop(THREE.LoopRepeat, Infinity);
    }
  }

  // Start with Sitting (or Idle as fallback)
  let currentAction = actions["Sitting"] || actions["Idle"];
  if (currentAction) {
    currentAction.play();
  }

  let currentAnimName = "";

  function crossfadeTo(name: string, duration = 0.5) {
    if (name === currentAnimName) return;
    const nextAction = actions[name];
    if (!nextAction) return;

    nextAction.reset();
    nextAction.setEffectiveTimeScale(1);
    nextAction.setEffectiveWeight(1);
    nextAction.play();

    if (currentAction && currentAction !== nextAction) {
      currentAction.crossFadeTo(nextAction, duration, true);
    }
    currentAction = nextAction;
    currentAnimName = name;
  }

  // ===========================
  // FIND ARM BONES FOR WRITING ANIMATION
  // ===========================
  let shoulderR: THREE.Bone | null = null;
  let upperArmR: THREE.Bone | null = null;
  let lowerArmR: THREE.Bone | null = null;
  model.traverse((child) => {
    if ((child as THREE.Bone).isBone) {
      if (child.name === "Shoulder.R") shoulderR = child as THREE.Bone;
      else if (child.name === "UpperArm.R") upperArmR = child as THREE.Bone;
      else if (child.name === "LowerArm.R") lowerArmR = child as THREE.Bone;
    }
  });

  // ===========================
  // DESK FURNITURE
  // ===========================
  const mat = new THREE.MeshNormalMaterial({ transparent: true });
  const furniture = new THREE.Group();

  // Desk top
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.7), mat);
  deskTop.position.set(0, 0.76, 0.6);
  furniture.add(deskTop);

  // Desk legs
  const deskLegGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 6);
  for (const [x, z] of [[-0.72, 0.28], [0.72, 0.28], [-0.72, 0.92], [0.72, 0.92]] as const) {
    const leg = new THREE.Mesh(deskLegGeo, mat);
    leg.position.set(x, 0.38, z);
    furniture.add(leg);
  }

  // Monitor
  const monitorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.02), mat);
  monitorScreen.position.set(0, 1.28, 0.85);
  monitorScreen.rotation.x = -0.08;
  furniture.add(monitorScreen);
  const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.22, 8), mat);
  monitorStand.position.set(0, 0.9, 0.85);
  furniture.add(monitorStand);
  const monitorBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), mat);
  monitorBase.position.set(0, 0.79, 0.85);
  furniture.add(monitorBase);

  // Keyboard
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.015, 0.15), mat);
  keyboard.position.set(0, 0.785, 0.55);
  furniture.add(keyboard);

  // Chair
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.45), mat);
  chairSeat.position.set(0, 0.58, -0.02);
  furniture.add(chairSeat);
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.04), mat);
  chairBack.position.set(0, 0.88, -0.23);
  furniture.add(chairBack);

  furniture.position.set(-1.3, -0.6, 0);
  scene.add(furniture);

  // ===========================
  // WHITEBOARD
  // ===========================
  const whiteboard = new THREE.Group();

  const boardSurface = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.04), mat);
  boardSurface.position.set(0, 1.5, 0);
  whiteboard.add(boardSurface);

  // Frame
  const frameH = new THREE.CylinderGeometry(0.025, 0.025, 1.45, 6);
  const frameV = new THREE.CylinderGeometry(0.025, 0.025, 1.05, 6);
  for (const [y, geo] of [[2.02, frameH], [0.98, frameH]] as const) {
    const f = new THREE.Mesh(geo, mat);
    f.position.set(0, y, 0.02);
    f.rotation.z = Math.PI / 2;
    whiteboard.add(f);
  }
  for (const x of [-0.72, 0.72]) {
    const f = new THREE.Mesh(frameV, mat);
    f.position.set(x, 1.5, 0.02);
    whiteboard.add(f);
  }

  // Board tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.08), mat);
  tray.position.set(0, 0.97, 0.06);
  whiteboard.add(tray);

  // Stand legs
  const standGeo = new THREE.CylinderGeometry(0.025, 0.03, 2.1, 8);
  for (const x of [-0.6, 0.6]) {
    const s = new THREE.Mesh(standGeo, mat);
    s.position.set(x, 0.45, 0.04);
    whiteboard.add(s);
  }

  // Code lines on board — animated (appear progressively during teaching)
  // Lines represent code being written: function header, body, closing
  const codeLines: THREE.Mesh[] = [];
  const codeWidths = [0.6, 0.35, 0.5, 0.45, 0.3, 0.55, 0.4, 0.25, 0.5, 0.35, 0.2];
  const codeIndents = [0, 0.1, 0.1, 0.15, 0.15, 0.1, 0.1, 0.15, 0.1, 0, 0];
  for (let i = 0; i < codeWidths.length; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(codeWidths[i], 0.022, 0.005),
      mat
    );
    line.position.set(
      -0.35 + codeIndents[i] + codeWidths[i] / 2,
      1.88 - i * 0.08,
      0.025
    );
    line.scale.x = 0; // hidden initially — will animate in
    whiteboard.add(line);
    codeLines.push(line);
  }

  whiteboard.position.set(4.5, -0.6, 0);
  whiteboard.rotation.y = -0.3;
  scene.add(whiteboard);

  // ===========================
  // CAMERA
  // ===========================
  const monitorWorldX = -1.3;
  const monitorWorldY = 0.68;
  const monitorWorldZ = 0.85;

  const cam = { x: 0, y: 1.5, z: 3, lx: -1.3, ly: 0.5, lz: 0.3 };
  const mouse = { cx: 0, cy: 0 };

  // Track current phase to trigger animation crossfades
  let currentPhase = -1;

  let smoothVelocity = 0;

  function update(
    time: number,
    mouseX: number,
    mouseY: number,
    scrollProgress: number,
    scrollVelocity = 0
  ) {
    mouse.cx = lerp(mouse.cx, mouseX, 0.04);
    mouse.cy = lerp(mouse.cy, mouseY, 0.04);

    const sp = scrollProgress;
    const delta = clock.getDelta();

    // Smooth the velocity so it decays naturally when scrolling stops
    smoothVelocity = lerp(smoothVelocity, scrollVelocity, 0.15);
    const isScrolling = smoothVelocity > 0.5;

    // Walking animation only plays when scrolling, otherwise paused
    if (currentAnimName === "Walking") {
      const walkAction = actions["Walking"];
      if (walkAction) {
        walkAction.setEffectiveTimeScale(isScrolling ? 1.0 : 0.0);
      }
    }

    mixer.update(delta);

    // === PHASES ===
    // 0.00-0.10: Seated coding
    // 0.10-0.18: Camera zooms to monitor
    // 0.18-0.38: Parked at monitor
    // 0.38-0.50: Camera pulls back
    // 0.50-0.68: Walking to whiteboard
    // 0.68-1.00: Teaching

    // Determine phase and trigger animation changes
    let phase = 0;
    if (sp <= 0.38) {
      phase = 0; // Sitting
    } else if (sp <= 0.52) {
      phase = 1; // Standing up
    } else if (sp <= 0.74) {
      phase = 2; // Walking (longer walk)
    } else {
      phase = 3; // Teaching / writing
    }

    if (phase !== currentPhase) {
      currentPhase = phase;
      if (phase === 0) crossfadeTo("Sitting", 0.4);
      else if (phase === 1) crossfadeTo("Standing", 0.5);
      else if (phase === 2) crossfadeTo("Walking", 0.4);
      else crossfadeTo("Idle", 0.5); // Idle body, we'll manually animate the arm
    }

    // === MODEL POSITION ===
    // Desk at (-1.3, -0.6, 0) — avatar faces +Z (the monitor)
    // Whiteboard at (4.5, -0.6, 0) — avatar stands in front at (4.5, -0.6, 0.7) facing -Z (the board)
    const deskPos = { x: -1.3, y: -0.6, z: -0.1 };
    const boardPos = { x: 4.5, y: -0.6, z: 0.7 };
    // Face -Z (toward the board surface) = PI (180 degrees)
    const faceBoardAngle = Math.PI;
    // Face +X (walking direction) = PI/2
    const walkAngle = Math.PI / 2;

    if (sp <= 0.50) {
      // At desk — facing +Z (the monitor)
      modelGroup.position.set(deskPos.x, deskPos.y, deskPos.z);
      modelGroup.rotation.y = 0;
    } else if (sp <= 0.68) {
      // Walking — face +X direction (toward whiteboard)
      const t = smoothstep(0.50, 0.68, sp);
      modelGroup.position.set(
        lerp(deskPos.x, boardPos.x, t),
        lerp(deskPos.y, boardPos.y, t),
        lerp(deskPos.z, boardPos.z, t)
      );
      modelGroup.rotation.y = walkAngle;
    } else if (sp <= 0.74) {
      // Arriving — turn from walking direction to face the board (-Z)
      const t = smoothstep(0.68, 0.74, sp);
      modelGroup.position.set(boardPos.x, boardPos.y, boardPos.z);
      modelGroup.rotation.y = lerp(walkAngle, faceBoardAngle, t);
    } else {
      // Teaching — facing the whiteboard, writing code
      modelGroup.position.set(boardPos.x, boardPos.y, boardPos.z);
      modelGroup.rotation.y = faceBoardAngle;
    }

    // === WRITING ANIMATION ===
    // Code lines appear progressively once avatar faces the board (0.74+)
    const writeProgress = smoothstep(0.74, 0.98, sp);
    for (let i = 0; i < codeLines.length; i++) {
      const lineStart = i / codeLines.length;
      const lineEnd = (i + 1) / codeLines.length;
      const lineT = smoothstep(lineStart, lineEnd, writeProgress);
      codeLines[i].scale.x = lineT;
    }

    // Right arm writing motion — only during teaching phase
    if (sp > 0.74 && shoulderR && upperArmR && lowerArmR) {
      // Raise arm to board height and move hand in a writing pattern
      // The writing motion: small horizontal sweeps that step down per line
      const writeTime = time * 3.0;
      const lineIndex = Math.floor(writeProgress * codeLines.length);
      const lineProgress = (writeProgress * codeLines.length) % 1;

      // Shoulder: raise arm forward toward the board
      shoulderR.rotation.x = -0.3;
      shoulderR.rotation.z = -0.8;

      // Upper arm: point toward board
      upperArmR.rotation.x = -1.2;
      upperArmR.rotation.z = 0.2;

      // Lower arm: writing motion — horizontal sweep + slight vertical step per line
      const sweepX = Math.sin(writeTime * 2.5) * 0.15; // left-right sweep
      const verticalOffset = (lineIndex / codeLines.length) * 0.4; // step down per line
      lowerArmR.rotation.x = -0.6 + verticalOffset + sweepX;
      lowerArmR.rotation.y = Math.sin(writeTime * 4) * 0.08; // small wrist wobble
      lowerArmR.rotation.z = -0.3 + lineProgress * 0.1; // slight extend as line is written
    }

    // === CAMERA ===
    let tx: number, ty: number, tz: number;
    let tlx: number, tly: number, tlz: number;

    if (sp <= 0.10) {
      // Phase 1: Angle view of seated avatar
      const angle = sp / 0.10 * 0.4;
      tx = monitorWorldX + Math.sin(angle) * 2.8;
      tz = Math.cos(angle) * 2.8;
      ty = 1.4;
      tlx = monitorWorldX;
      tly = monitorWorldY + 0.3;
      tlz = 0.3;

    } else if (sp <= 0.18) {
      // Phase 2: Zoom into monitor
      const t = smoothstep(0.10, 0.18, sp);
      const fromX = monitorWorldX + Math.sin(0.4) * 2.8;
      const fromZ = Math.cos(0.4) * 2.8;
      tx = lerp(fromX, monitorWorldX, t);
      ty = lerp(1.4, monitorWorldY + 0.05, t);
      tz = lerp(fromZ, monitorWorldZ - 0.6, t);
      tlx = monitorWorldX;
      tly = monitorWorldY;
      tlz = monitorWorldZ;

    } else if (sp <= 0.38) {
      // Phase 3: Parked at monitor
      tx = monitorWorldX;
      ty = monitorWorldY + 0.05;
      tz = monitorWorldZ - 0.6;
      tlx = monitorWorldX;
      tly = monitorWorldY;
      tlz = monitorWorldZ;

    } else if (sp <= 0.50) {
      // Phase 4: Pull back
      const t = smoothstep(0.38, 0.50, sp);
      tx = lerp(monitorWorldX, -0.5, t);
      ty = lerp(monitorWorldY + 0.05, 1.4, t);
      tz = lerp(monitorWorldZ - 0.6, 3.0, t);
      tlx = lerp(monitorWorldX, -0.2, t);
      tly = lerp(monitorWorldY, 0.8, t);
      tlz = lerp(monitorWorldZ, 0.3, t);

    } else if (sp <= 0.74) {
      // Phase 5: Follow the longer walk — camera tracks from the side
      const t = smoothstep(0.50, 0.74, sp);
      const figX = modelGroup.position.x;
      tx = figX + 0.5;
      ty = 1.3;
      tz = 3.0; // camera stays on +Z side, watching from the side
      tlx = figX;
      tly = 0.4;
      tlz = 0;

    } else {
      // Phase 6: Teaching — camera from the side so we see avatar facing the board
      // Avatar is at (4.5, z=0.7) facing -Z toward board at z=0
      // Camera positioned to the side (+X, +Z) looking at the scene
      const figX = modelGroup.position.x;
      const sway = Math.sin(time * 0.12) * 0.03;
      tx = figX + 1.8 + sway;  // to the right of avatar
      ty = 1.2;
      tz = 1.5;                  // offset on +Z to see avatar's side profile + board
      // Look at the midpoint between avatar and board
      tlx = figX;
      tly = 0.7;
      tlz = 0.35;               // between avatar (z=0.7) and board (z=0)
    }

    // Smooth camera
    cam.x = lerp(cam.x, tx + mouse.cx * 0.12, 0.06);
    cam.y = lerp(cam.y, ty + mouse.cy * -0.08, 0.06);
    cam.z = lerp(cam.z, tz + mouse.cy * 0.08, 0.06);
    cam.lx = lerp(cam.lx, tlx, 0.06);
    cam.ly = lerp(cam.ly, tly, 0.06);
    cam.lz = lerp(cam.lz, tlz, 0.06);

    camera.position.set(cam.x, cam.y, cam.z);
    camera.lookAt(cam.lx, cam.ly, cam.lz);
  }

  function resize(aspect: number) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  return { scene, camera, update, resize, dispose };
}
