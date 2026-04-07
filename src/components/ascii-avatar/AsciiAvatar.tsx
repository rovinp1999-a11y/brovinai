"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { generateCharAtlas } from "./charAtlasGenerator";
import { createAvatarScene } from "./createAvatarScene";
import { createAsciiPipeline } from "./asciiRenderPipeline";

// 16 chars by pixel density for high-detail rendering
const CHARSET = " .:-~=+*%#&$@WM";

// Narrative zone ends at roughly 55% of total page scroll
// (6.5 viewports of narrative sections out of ~12 total viewports)
const SCROLL_END = 0.55;

// Multi-phase opacity curve
function getAvatarOpacity(rawProgress: number): number {
  const sp = Math.min(1, rawProgress / SCROLL_END);

  // 0.00-0.10: visible behind hero text (0.7)
  if (sp <= 0.10) return 0.7;
  // 0.10-0.16: brightens as camera zooms in (0.7 → 1.0)
  if (sp <= 0.16) return 0.7 + ((sp - 0.10) / 0.06) * 0.3;
  // 0.16-0.38: fade out for monitor content (1.0 → 0.0)
  if (sp <= 0.38) return 1.0 - (sp - 0.16) / 0.22;
  // 0.38-0.50: fade back in as camera pulls out (0.0 → 0.8)
  if (sp <= 0.50) return ((sp - 0.38) / 0.12) * 0.8;
  // 0.50-0.96: visible during all content phases including desk zoom
  if (sp <= 0.96) return 0.8;
  // 0.96-1.0: quick fade at the very end
  return 0.8 * (1 - (sp - 0.96) / 0.04);
}

export function AsciiAvatar({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    // Don't skip mobile — run with lower quality instead

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationId: number;
    let disposed = false;

    const mouse = { x: 0, y: 0 };
    let scrollProgress = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;
    let opacity = 0.7;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      scrollProgress = Math.min(1, rawProgress / SCROLL_END);
      opacity = getAvatarOpacity(rawProgress);

      // Track scroll velocity (how fast the user is scrolling)
      scrollVelocity = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    async function init() {
      if (disposed || !canvas) return;
      const el = canvas;

      await document.fonts.ready;
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: el,
        alpha: true,
        antialias: false,
        stencil: false,
        depth: false,
        powerPreference: "high-performance",
      });
      const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
      renderer.setPixelRatio(dpr);

      const width = el.clientWidth;
      const height = el.clientHeight;
      renderer.setSize(width, height, false);

      const charAtlasCanvas = generateCharAtlas(CHARSET);
      const avatar = await createAvatarScene();
      if (disposed) return;
      avatar.resize(width / height);

      const pipeline = createAsciiPipeline(
        renderer,
        charAtlasCanvas,
        CHARSET.length
      );
      pipeline.resize(Math.floor(width * dpr), Math.floor(height * dpr));

      const clock = new THREE.Clock();

      function animate() {
        if (disposed) return;
        animationId = requestAnimationFrame(animate);

        if (opacity <= 0.01) {
          el.style.opacity = "0";
          return;
        }

        el.style.opacity = String(Math.max(0, opacity));

        const elapsed = clock.getElapsedTime();

        avatar.update(elapsed, mouse.x, mouse.y, scrollProgress, scrollVelocity);
        pipeline.updateTime(elapsed);

        renderer.setRenderTarget(pipeline.renderTarget);
        renderer.setClearColor(0x000000, 1);
        renderer.clear();
        renderer.render(avatar.scene, avatar.camera);

        renderer.setRenderTarget(null);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(pipeline.asciiScene, pipeline.asciiCamera);
      }

      const onResize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w === 0 || h === 0) return;

        renderer.setSize(w, h, false);
        avatar.resize(w / h);
        pipeline.resize(Math.floor(w * dpr), Math.floor(h * dpr));
      };
      window.addEventListener("resize", onResize);

      if (reducedMotion) {
        avatar.update(0, 0, 0, 0, 0);
        pipeline.updateTime(0);
        renderer.setRenderTarget(pipeline.renderTarget);
        renderer.setClearColor(0x000000, 1);
        renderer.clear();
        renderer.render(avatar.scene, avatar.camera);
        renderer.setRenderTarget(null);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(pipeline.asciiScene, pipeline.asciiCamera);
      } else {
        animate();
      }

      const cleanupGL = () => {
        window.removeEventListener("resize", onResize);
        avatar.dispose();
        pipeline.dispose();
        renderer.dispose();
      };

      (el as unknown as Record<string, () => void>).__cleanupGL = cleanupGL;
    }

    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      const cleanup = (canvas as unknown as Record<string, () => void>)
        ?.__cleanupGL;
      if (cleanup) cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
