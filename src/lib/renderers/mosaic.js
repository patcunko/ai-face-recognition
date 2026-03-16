const BLOCK = 18;

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

export function renderMosaic(canvas, results) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;

  const { off, oCtx } = getOffscreen(w, h);
  oCtx.drawImage(results.image, 0, 0, w, h);
  const data = oCtx.getImageData(0, 0, w, h).data;

  const cols = Math.ceil(w / BLOCK);
  const rows = Math.ceil(h / BLOCK);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let r = 0, g = 0, b = 0, count = 0;

      for (let dy = 0; dy < BLOCK; dy++) {
        for (let dx = 0; dx < BLOCK; dx++) {
          const px = col * BLOCK + dx;
          const py = row * BLOCK + dy;
          if (px >= w || py >= h) continue;
          const idx = (py * w + px) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }

      ctx.fillStyle = `rgb(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)})`;
      ctx.fillRect(col * BLOCK, row * BLOCK, BLOCK, BLOCK);
    }
  }
}
