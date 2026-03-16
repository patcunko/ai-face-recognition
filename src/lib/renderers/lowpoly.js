// Reconstruct triangle list from FACEMESH_TESSELATION edges (computed once).
let faceTriangles = null;

function computeFaceTriangles() {
  const adj = new Map();
  for (const [a, b] of FACEMESH_TESSELATION) {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a).add(b);
    adj.get(b).add(a);
  }

  const triangles = [];
  for (const [a, aNeighbors] of adj) {
    for (const b of aNeighbors) {
      if (b <= a) continue;
      const bNeighbors = adj.get(b);
      for (const c of aNeighbors) {
        if (c > b && bNeighbors.has(c)) {
          triangles.push([a, b, c]);
        }
      }
    }
  }
  return triangles;
}

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

export function renderLowPoly(canvas, results) {
  if (!results.faceLandmarks?.length) return;
  if (!faceTriangles) faceTriangles = computeFaceTriangles();

  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const lm = results.faceLandmarks;

  const { off, oCtx } = getOffscreen(w, h);
  oCtx.drawImage(results.image, 0, 0, w, h);
  const data = oCtx.getImageData(0, 0, w, h).data;

  function sampleColor(x, y) {
    const px  = Math.max(0, Math.min(w - 1, Math.round(x)));
    const py  = Math.max(0, Math.min(h - 1, Math.round(y)));
    const idx = (py * w + px) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  for (const [i1, i2, i3] of faceTriangles) {
    const p1 = lm[i1], p2 = lm[i2], p3 = lm[i3];
    if (!p1 || !p2 || !p3) continue;

    const x1 = p1.x * w, y1 = p1.y * h;
    const x2 = p2.x * w, y2 = p2.y * h;
    const x3 = p3.x * w, y3 = p3.y * h;

    const [r, g, b] = sampleColor((x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3);
    const fill = `rgb(${r},${g},${b})`;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle   = fill;
    ctx.strokeStyle = fill;
    ctx.lineWidth   = 0.5;
    ctx.fill();
    ctx.stroke();
  }
}
