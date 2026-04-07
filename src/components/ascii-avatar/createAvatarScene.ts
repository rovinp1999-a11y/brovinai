import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";

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
  const mat = new THREE.MeshNormalMaterial({ transparent: true });
  const clock = new THREE.Clock();

  // ===========================
  // LOAD MODEL
  // ===========================
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync("/models/human.glb");
  const baseModel = gltf.scene;

  baseModel.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = normalMat;
    }
  });
  baseModel.scale.setScalar(0.47);

  // Strip position tracks
  for (const clip of gltf.animations) {
    clip.tracks = clip.tracks.filter((t) => !t.name.endsWith(".position"));
  }

  const clips: Record<string, THREE.AnimationClip> = {};
  for (const clip of gltf.animations) clips[clip.name] = clip;

  // ===========================
  // HELPER: create a desk unit (desk + monitor + chair)
  // ===========================
  function createDesk(x: number, z: number, rotY = 0) {
    const g = new THREE.Group();
    // Desk top
    const dt = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.7), mat);
    dt.position.set(0, 0.76, 0.6); g.add(dt);
    // Legs
    const lg = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 6);
    for (const [lx, lz] of [[-0.72, 0.28], [0.72, 0.28], [-0.72, 0.92], [0.72, 0.92]] as const) {
      const l = new THREE.Mesh(lg, mat); l.position.set(lx, 0.38, lz); g.add(l);
    }
    // Monitor
    const ms = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.02), mat);
    ms.position.set(0, 1.28, 0.85); ms.rotation.x = -0.08; g.add(ms);
    const mst = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.22, 8), mat);
    mst.position.set(0, 0.9, 0.85); g.add(mst);
    const mb = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), mat);
    mb.position.set(0, 0.79, 0.85); g.add(mb);
    // Keyboard
    const kb = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.015, 0.15), mat);
    kb.position.set(0, 0.785, 0.55); g.add(kb);
    // Chair
    const cs = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.45), mat);
    cs.position.set(0, 0.58, -0.02); g.add(cs);
    const cb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.04), mat);
    cb.position.set(0, 0.88, -0.23); cb.rotation.x = 0.05; g.add(cb);

    g.position.set(x, -0.6, z);
    g.rotation.y = rotY;
    return g;
  }

  // ===========================
  // HELPER: clone avatar with its own mixer
  // ===========================
  function createAvatar() {
    const cloned = cloneSkeleton(baseModel);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = normalMat;
      }
    });
    const group = new THREE.Group();
    group.add(cloned);

    // Find head bone for tilting
    let headBone: THREE.Bone | null = null;
    cloned.traverse((child) => {
      if ((child as THREE.Bone).isBone && child.name === "Head") {
        headBone = child as THREE.Bone;
      }
    });

    const mx = new THREE.AnimationMixer(cloned);
    const acts: Record<string, THREE.AnimationAction> = {};
    for (const name of ["Sitting", "Idle", "Walking"]) {
      if (clips[name]) {
        acts[name] = mx.clipAction(clips[name]);
        acts[name].setLoop(THREE.LoopRepeat, Infinity);
      }
    }

    let active = "";
    function play(name: string) {
      if (name === active || !acts[name]) return;
      const next = acts[name];
      next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
      if (active && acts[active]) acts[active].crossFadeTo(next, 0.8, true);
      active = name;
    }

    return { model: cloned, group, mixer: mx, actions: acts, play, active: () => active, headBone: headBone as THREE.Bone | null };
  }

  // ===========================
  // SCENE 1: Single desk + main avatar (hero + my-story)
  // ===========================
  const mainDesk = createDesk(-1.3, 0);
  scene.add(mainDesk);

  const mainAvatar = createAvatar();
  mainAvatar.group.position.set(-1.3, -0.6, -0.1);
  mainAvatar.play("Sitting");
  scene.add(mainAvatar.group);

  // ===========================
  // SCENE 2: Clone scene — two avatars side by side (content 2)
  // ===========================
  const cloneLeft = createAvatar();
  cloneLeft.group.position.set(-1.5, -0.6, 0);
  cloneLeft.group.visible = false;
  cloneLeft.play("Idle");
  scene.add(cloneLeft.group);

  const cloneRight = createAvatar();
  cloneRight.group.position.set(1.5, -0.6, 0);
  cloneRight.group.visible = false;
  cloneRight.play("Idle");
  scene.add(cloneRight.group);

  // ===========================
  // SCENE 3: Office — 5 desks in a circle, each with an avatar sitting
  // ===========================
  const officeDesks: THREE.Group[] = [];
  const officeAvatars: ReturnType<typeof createAvatar>[] = [];
  const officeRadius = 5;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const dx = Math.sin(angle) * officeRadius;
    const dz = Math.cos(angle) * officeRadius;
    // Desk faces center
    const desk = createDesk(dx, dz, angle + Math.PI);
    desk.visible = false;
    scene.add(desk);
    officeDesks.push(desk);

    const av = createAvatar();
    av.group.position.set(dx, -0.6, dz);
    av.group.rotation.y = angle + Math.PI;
    av.group.visible = false;
    av.play("Sitting");
    // Freeze in sitting pose — no leg or body movement
    if (av.actions["Sitting"]) {
      av.actions["Sitting"].setEffectiveTimeScale(0);
      av.actions["Sitting"].time = 0.5; // hold at a mid-pose frame
    }
    scene.add(av.group);
    officeAvatars.push(av);
  }

  // ===========================
  // WHITEBOARD (for content 1 — teaching)
  // ===========================
  const whiteboard = new THREE.Group();

  // Board surface
  const bs = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.04), mat);
  bs.position.set(0, 1.5, 0);
  whiteboard.add(bs);

  // Frame — horizontal bars
  const fH = new THREE.CylinderGeometry(0.025, 0.025, 1.45, 6);
  for (const y of [2.02, 0.98]) {
    const f = new THREE.Mesh(fH, mat);
    f.position.set(0, y, 0.02);
    f.rotation.z = Math.PI / 2;
    whiteboard.add(f);
  }
  // Frame — vertical bars
  const fV = new THREE.CylinderGeometry(0.025, 0.025, 1.05, 6);
  for (const x of [-0.72, 0.72]) {
    const f = new THREE.Mesh(fV, mat);
    f.position.set(x, 1.5, 0.02);
    whiteboard.add(f);
  }

  // Marker tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.08), mat);
  tray.position.set(0, 0.97, 0.06);
  whiteboard.add(tray);

  // Stand legs (behind the board, angled back)
  const standGeo = new THREE.CylinderGeometry(0.025, 0.035, 2.1, 8);
  for (const x of [-0.6, 0.6]) {
    const s = new THREE.Mesh(standGeo, mat);
    s.position.set(x, 0.45, -0.15);
    s.rotation.x = 0.12; // angled back for stability
    whiteboard.add(s);
  }
  // Stand cross-bar (behind)
  const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), mat);
  crossBar.position.set(0, 0.25, -0.18);
  crossBar.rotation.z = Math.PI / 2;
  whiteboard.add(crossBar);

  // === BOARD CONTENT: workflow formula + code snippets ===
  // Title line: "AI WORKFLOW"
  const titleLine = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.005), mat);
  titleLine.position.set(-0.15, 1.90, 0.025);
  whiteboard.add(titleLine);
  // Underline
  const underline = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.008, 0.005), mat);
  underline.position.set(-0.10, 1.87, 0.025);
  whiteboard.add(underline);

  // Flowchart boxes (3 connected boxes: Input → Agent → Output)
  const boxGeo = new THREE.BoxGeometry(0.22, 0.12, 0.005);
  const box1 = new THREE.Mesh(boxGeo, mat);
  box1.position.set(-0.45, 1.72, 0.025);
  whiteboard.add(box1);
  const box2 = new THREE.Mesh(boxGeo, mat);
  box2.position.set(0, 1.72, 0.025);
  whiteboard.add(box2);
  const box3 = new THREE.Mesh(boxGeo, mat);
  box3.position.set(0.45, 1.72, 0.025);
  whiteboard.add(box3);

  // Arrows between boxes
  const arrowGeo = new THREE.BoxGeometry(0.12, 0.01, 0.005);
  const arr1 = new THREE.Mesh(arrowGeo, mat);
  arr1.position.set(-0.225, 1.72, 0.025);
  whiteboard.add(arr1);
  const arr2 = new THREE.Mesh(arrowGeo, mat);
  arr2.position.set(0.225, 1.72, 0.025);
  whiteboard.add(arr2);
  // Arrow tips (small triangles approximated as rotated boxes)
  for (const ax of [-0.17, 0.28]) {
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.005), mat);
    tip.position.set(ax, 1.72, 0.025);
    tip.rotation.z = Math.PI / 4;
    whiteboard.add(tip);
  }

  // Code-like text lines below the flowchart
  const codeData = [
    { w: 0.50, indent: 0 },     // function runAgent() {
    { w: 0.40, indent: 0.06 },  //   const task = getTask()
    { w: 0.45, indent: 0.06 },  //   const result = ai.execute(task)
    { w: 0.30, indent: 0.06 },  //   return result
    { w: 0.15, indent: 0 },     // }
    { w: 0.10, indent: 0 },     // (blank)
    { w: 0.55, indent: 0 },     // const agents = [researcher, dev, writer]
    { w: 0.45, indent: 0 },     // agents.forEach(a => a.run())
    { w: 0.35, indent: 0 },     // // ship it 🚀
  ];
  for (let i = 0; i < codeData.length; i++) {
    const { w, indent } = codeData[i];
    if (w < 0.12) continue; // skip blanks visually
    const line = new THREE.Mesh(new THREE.BoxGeometry(w, 0.018, 0.005), mat);
    line.position.set(-0.35 + indent + w / 2, 1.55 - i * 0.05, 0.025);
    whiteboard.add(line);
  }

  // Bullet points on the right side (planning notes)
  const bulletData = [0.30, 0.25, 0.35, 0.20, 0.28];
  for (let i = 0; i < bulletData.length; i++) {
    // Bullet dot
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), mat);
    dot.position.set(0.25, 1.55 - i * 0.06, 0.025);
    whiteboard.add(dot);
    // Text line
    const line = new THREE.Mesh(new THREE.BoxGeometry(bulletData[i], 0.015, 0.005), mat);
    line.position.set(0.28 + bulletData[i] / 2, 1.55 - i * 0.06, 0.025);
    whiteboard.add(line);
  }

  whiteboard.position.set(4.5, -0.6, 0);
  whiteboard.rotation.y = -0.3;
  scene.add(whiteboard);

  // ===========================
  // STATE
  // ===========================
  const monX = -1.3, monY = 0.68, monZ = 0.85;
  const cam = { x: monX + 1.5, y: 1.0, z: 2.8, lx: monX, ly: 0.6, lz: 0.3 };
  let prevPhase = -1;

  function update(
    time: number,
    mouseX: number,
    mouseY: number,
    sp: number,
    _scrollVelocity = 0
  ) {
    const delta = clock.getDelta();
    const r = 0.03; // slower camera smoothing for buttery transitions

    // Update all mixers
    mainAvatar.mixer.update(delta);
    cloneLeft.mixer.update(delta);
    cloneRight.mixer.update(delta);
    for (const av of officeAvatars) av.mixer.update(delta);

    // ===========================
    // CONTENT PHASES (sp 0-1 mapped from SCROLL_END=0.55)
    // ===========================
    // 0.00-0.10: Hero — avatar sitting at desk
    // 0.10-0.25: Camera zooms to monitor, my-story.md
    // 0.25-0.40: Pull back
    // 0.40-0.54: Content 1 — whiteboard teaching
    // 0.54-0.70: Content 2 — clone split
    // 0.70-0.88: Content 3 — office 360
    // 0.88-1.00: Content 4 — fade out

    let phase = 0;
    if (sp <= 0.25) phase = 0;       // Desk + monitor zoom
    else if (sp <= 0.54) phase = 1;  // Whiteboard teaching
    else if (sp <= 0.70) phase = 2;  // Clone split
    else if (sp <= 0.90) phase = 3;  // Office 360
    else phase = 4;                   // Fade out

    if (phase !== prevPhase) {
      prevPhase = phase;
      if (phase === 0) mainAvatar.play("Sitting");
      // Walking and Idle handled in position logic above
    }

    // ===========================
    // VISIBILITY
    // ===========================
    // Main desk + avatar: visible in phase 0-1
    mainDesk.visible = sp < 0.56;
    mainAvatar.group.visible = sp < 0.56;
    whiteboard.visible = sp > 0.35 && sp < 0.56;

    // Clones: appear early so you see one standing as camera pans right
    const cloneVis = sp > 0.50 && sp < 0.75;
    cloneLeft.group.visible = cloneVis;
    cloneRight.group.visible = cloneVis;

    // Office: visible in phase 3
    const officeVis = sp > 0.68 && sp < 0.98;
    for (const d of officeDesks) d.visible = officeVis;
    for (const av of officeAvatars) av.group.visible = officeVis;

    // ===========================
    // PHASE 0: Desk + monitor zoom
    // ===========================
    if (sp <= 0.28) {
      // Sitting at desk
      mainAvatar.group.position.set(-1.3, -0.6, -0.1);
      mainAvatar.group.rotation.y = 0;

    } else if (sp <= 0.31) {
      // Crossfade from Sitting → Standing (lean forward, getting up)
      const t = smoothstep(0.28, 0.31, sp);
      mainAvatar.group.position.set(-1.3, -0.6, lerp(-0.1, -0.05, t));
      mainAvatar.group.rotation.y = 0;
      if (mainAvatar.active() !== "Standing") mainAvatar.play("Standing");

    } else if (sp <= 0.34) {
      // Now standing — crossfade to Idle, step back from chair
      const t = smoothstep(0.31, 0.34, sp);
      mainAvatar.group.position.set(-1.3, -0.6, lerp(-0.05, 0.1, t));
      mainAvatar.group.rotation.y = 0;
      if (mainAvatar.active() !== "Idle") mainAvatar.play("Idle");

    } else if (sp <= 0.37) {
      // Turn to face walking direction
      const t = smoothstep(0.34, 0.37, sp);
      mainAvatar.group.position.set(-1.3, -0.6, 0.1);
      mainAvatar.group.rotation.y = lerp(0, Math.PI / 2, t);

    } else if (sp <= 0.48) {
      // Walk to whiteboard — scrub walk animation with scroll
      const t = smoothstep(0.37, 0.48, sp);
      mainAvatar.group.position.set(
        lerp(-1.3, 3.5, t), -0.6, lerp(0.1, 0.5, t)
      );
      mainAvatar.group.rotation.y = Math.PI / 2;

      // Scrub walk clip
      const walkAct = mainAvatar.actions["Walking"];
      if (walkAct) {
        if (mainAvatar.active() !== "Walking") mainAvatar.play("Walking");
        walkAct.setEffectiveTimeScale(0);
        const dur = walkAct.getClip().duration;
        walkAct.time = (t * dur * 4) % dur;
      }
    } else if (sp <= 0.54) {
      // Turn to face whiteboard
      const t = smoothstep(0.48, 0.52, sp);
      mainAvatar.group.position.set(3.5, -0.6, 0.5);
      mainAvatar.group.rotation.y = lerp(Math.PI / 2, Math.PI, t);
      if (mainAvatar.active() !== "Idle") mainAvatar.play("Idle");
    }

    // PHASE 2: Both clones start stacked at x=10 (looks like one agent)
    // Then split apart when scrolling further
    if (sp > 0.50 && sp <= 0.75) {
      if (sp <= 0.61) {
        // Before split — both at same position, looks like one agent
        cloneLeft.group.position.set(10, -0.6, 0);
        cloneLeft.group.rotation.y = 0;
        cloneRight.group.position.set(10, -0.6, 0);
        cloneRight.group.rotation.y = 0;
      } else {
        // Split apart
        const t = smoothstep(0.61, 0.71, sp);
        cloneLeft.group.position.set(lerp(10, 8, t), -0.6, lerp(0, 0.5, t));
        cloneLeft.group.rotation.y = lerp(0, -0.3, t);
        cloneRight.group.position.set(lerp(10, 12, t), -0.6, lerp(0, 0.5, t));
        cloneRight.group.rotation.y = lerp(0, 0.3, t);
      }
    }

    // ===========================
    // PHASE 3: Office 360 — heads tilt around while sitting
    // ===========================
    if (officeVis) {
      for (let i = 0; i < officeAvatars.length; i++) {
        const av = officeAvatars[i];
        if (av.headBone) {
          // Each avatar looks around at different speeds/phases
          const phase = i * 1.3;
          av.headBone.rotation.y = Math.sin(time * 0.6 + phase) * 0.3;
          av.headBone.rotation.x = Math.sin(time * 0.4 + phase * 0.7) * 0.15 - 0.1;
          av.headBone.rotation.z = Math.sin(time * 0.3 + phase * 1.2) * 0.08;
        }
      }
    }

    // ===========================
    // CAMERA
    // ===========================
    let tx: number, ty: number, tz: number;
    let tlx: number, tly: number, tlz: number;

    if (sp <= 0.10) {
      // Orbit desk
      const a = sp / 0.10 * 0.4;
      tx = monX + Math.sin(a) * 2.8;
      tz = Math.cos(a) * 2.8;
      ty = 1.4;
      tlx = monX; tly = monY + 0.3; tlz = 0.3;

    } else if (sp <= 0.18) {
      // Zoom to monitor
      const t = smoothstep(0.10, 0.18, sp);
      tx = lerp(monX + Math.sin(0.4) * 2.8, monX, t);
      ty = lerp(1.4, monY, t);
      tz = lerp(Math.cos(0.4) * 2.8, monZ - 0.25, t);
      tlx = monX; tly = monY; tlz = monZ;

    } else if (sp <= 0.30) {
      // Parked at monitor (my-story visible)
      tx = monX; ty = monY; tz = monZ - 0.25;
      tlx = monX; tly = monY; tlz = monZ;

    } else if (sp <= 0.54) {
      // Pull back + pan to whiteboard area
      const t = smoothstep(0.30, 0.48, sp);
      tx = lerp(monX, 4.5 + 2.0, t);
      ty = lerp(monY, 1.0, t);
      tz = lerp(monZ - 0.25, 2.0, t);
      tlx = lerp(monX, 4.5, t);
      tly = lerp(monY, 0.8, t);
      tlz = lerp(monZ, 0, t);

    } else if (sp <= 0.70) {
      // Content 2: Camera pans right to see the two clones
      const t = smoothstep(0.54, 0.62, sp);
      tx = lerp(4.5 + 2.0, 10, t);
      ty = lerp(1.0, 1.2, t);
      tz = lerp(2.0, 5.0, t);
      tlx = 10; tly = 0.4; tlz = 0.5;

    } else if (sp <= 0.90) {
      // Content 3: 360 orbit around the office
      const t = smoothstep(0.70, 0.90, sp);
      const orbitAngle = t * Math.PI * 2;
      const orbitR = 8;
      tx = Math.sin(orbitAngle) * orbitR;
      ty = 2.5;
      tz = Math.cos(orbitAngle) * orbitR;
      tlx = 0; tly = 0; tlz = 0;

    } else if (sp <= 0.96) {
      // Content 4a: Zoom into one avatar's desktop (first avatar at angle 0)
      // Avatar 0 is at (sin(0)*5, -0.6, cos(0)*5) = (0, -0.6, 5), facing (0+PI)
      // Its monitor is at roughly (0, 0.68, 5.85) in world space
      const t = smoothstep(0.90, 0.96, sp);
      const deskX = Math.sin(0) * officeRadius; // 0
      const deskZ = Math.cos(0) * officeRadius; // 5
      const monDeskY = 0.68;
      const monDeskZ = deskZ + 0.85;

      tx = lerp(Math.sin(Math.PI * 2) * 8, deskX, t);
      ty = lerp(2.5, monDeskY, t);
      tz = lerp(Math.cos(Math.PI * 2) * 8, monDeskZ - 0.3, t);
      tlx = deskX;
      tly = monDeskY;
      tlz = monDeskZ;

    } else {
      // Content 4b: Slowly zoom into the screen then fade
      const t = smoothstep(0.96, 1.0, sp);
      const deskZ = Math.cos(0) * officeRadius;
      const monDeskZ = deskZ + 0.85;

      tx = 0;
      ty = 0.68;
      tz = lerp(monDeskZ - 0.3, monDeskZ - 0.1, t); // creep closer to screen
      tlx = 0;
      tly = 0.68;
      tlz = monDeskZ;
    }

    cam.x = lerp(cam.x, tx + mouseX * 0.1, r);
    cam.y = lerp(cam.y, ty + mouseY * -0.06, r);
    cam.z = lerp(cam.z, tz + mouseY * 0.06, r);
    cam.lx = lerp(cam.lx, tlx, r);
    cam.ly = lerp(cam.ly, tly, r);
    cam.lz = lerp(cam.lz, tlz, r);

    camera.position.set(cam.x, cam.y, cam.z);
    camera.lookAt(cam.lx, cam.ly, cam.lz);
  }

  function resize(aspect: number) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
  }

  return { scene, camera, update, resize, dispose };
}
