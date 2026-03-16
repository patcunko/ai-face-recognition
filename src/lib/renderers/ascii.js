const CHARS   = ' .,:;+*=#@$';
const CELL_W  = 7;
const CELL_H  = 14;

let offscreen = null;
let offCtx    = null;

function getOffscreen(w, h) {
  if (!offscreen) {
    offscreen = document.createElement('canvas');
    offCtx    = offscreen.getContext('2d', { willReadFrequently: true });
  }
  offscreen.width  = w;
  offscreen.height = h;
  return { off: offscreen, oCtx: offCtx };
}

export function renderAscii(canvas, results) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;

  const { off, oCtx } = getOffscreen(w, h);
  oCtx.drawImage(results.image, 0, 0, w, h);
  const data = oCtx.getImageData(0, 0, w, h).data;

  ctx.font         = `${CELL_H}px 'Courier New', monospace`;
  ctx.textBaseline = 'top';

  const cols = Math.floor(w / CELL_W);
  const rows = Math.floor(h / CELL_H);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px  = Math.min(w - 1, Math.floor((col + 0.5) * CELL_W));
      const py  = Math.min(h - 1, Math.floor((row + 0.5) * CELL_H));
      const idx = (py * w + px) * 4;
      const r   = data[idx];
      const g   = data[idx + 1];
      const b   = data[idx + 2];

      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const char = CHARS[Math.floor(brightness * (CHARS.length - 1))];

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillText(char, col * CELL_W, row * CELL_H);
    }
  }
}
