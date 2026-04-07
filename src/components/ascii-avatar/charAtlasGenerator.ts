const DEFAULT_CHARSET = " .:;+=$&@#%WXMK";
const DEFAULT_FONT_SIZE = 64;
const DEFAULT_RESOLUTION = 1024;
const GRID_SIZE = 16;

export function generateCharAtlas(
  charset = DEFAULT_CHARSET,
  fontSize = DEFAULT_FONT_SIZE,
  resolution = DEFAULT_RESOLUTION
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;

  const ctx = canvas.getContext("2d")!;
  const cellSize = resolution / GRID_SIZE;

  // Black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, resolution, resolution);

  // Draw each character centered in its grid cell
  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < charset.length; i++) {
    const col = i % GRID_SIZE;
    const row = Math.floor(i / GRID_SIZE);
    const x = col * cellSize + cellSize / 2;
    const y = row * cellSize + cellSize / 2;
    ctx.fillText(charset[i], x, y);
  }

  return canvas;
}
