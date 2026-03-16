const activeEffects = [];

/** Add a burst effect centred on (x, y) in normalised [0,1] coordinates. */
export function addEffect({ x, y, duration = 1.5 }) {
  activeEffects.push({ x, y, duration, startTime: performance.now() });
}

/** Call once per frame after the mode renderer to draw all active effects. */
export function renderEffects(canvas) {
  if (!activeEffects.length) return;

  const ctx  = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const now  = performance.now();
  const maxR = Math.min(w, h) * 0.28;

  for (let i = activeEffects.length - 1; i >= 0; i--) {
    const e        = activeEffects[i];
    const age      = (now - e.startTime) / 1000;
    if (age > e.duration) { activeEffects.splice(i, 1); continue; }

    const progress = age / e.duration;
    const alpha    = 1 - progress;
    const px       = e.x * w;
    const py       = e.y * h;

    // ── Expanding concentric rings ─────────────────────────────────────────
    for (let ring = 0; ring < 4; ring++) {
      const rp = (progress + ring * 0.2) % 1;
      const r  = rp * maxR;
      const a  = alpha * (1 - rp) * 0.95;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 220, 255, ${a.toFixed(2)})`;
      ctx.lineWidth   = 2.5 * (1 - rp);
      ctx.shadowColor = 'rgba(0, 220, 255, 1)';
      ctx.shadowBlur  = 24;
      ctx.stroke();
      ctx.restore();
    }

    // ── Radial burst lines ─────────────────────────────────────────────────
    const outerR = progress * maxR;
    const innerR = Math.max(0, outerR - maxR * 0.18);
    ctx.save();
    ctx.strokeStyle = `rgba(0, 220, 255, ${(alpha * 0.75).toFixed(2)})`;
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = 'rgba(0, 220, 255, 0.9)';
    ctx.shadowBlur  = 14;
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(px + Math.cos(angle) * innerR, py + Math.sin(angle) * innerR);
      ctx.lineTo(px + Math.cos(angle) * outerR, py + Math.sin(angle) * outerR);
      ctx.stroke();
    }
    ctx.restore();
  }
}
