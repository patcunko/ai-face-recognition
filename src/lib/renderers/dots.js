const FACE_COLOR = 'rgba(0, 220, 255, 0.9)';
const BODY_COLOR = 'rgba(0, 255, 140, 0.9)';
const HAND_COLOR = 'rgba(255, 60, 220, 0.9)';

function drawDots(ctx, w, h, landmarks, color, radius) {
  if (!landmarks) return;
  ctx.save();
  ctx.fillStyle   = color;
  ctx.shadowColor = color;
  ctx.shadowBlur  = 8;
  for (const lm of landmarks) {
    if (!lm) continue;
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function renderDots(canvas, results) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;

  if (results.faceLandmarks?.length) {
    drawDots(ctx, w, h, results.faceLandmarks, FACE_COLOR, 1.2);
  }
  if (results.poseLandmarks?.length) {
    drawDots(ctx, w, h, results.poseLandmarks, BODY_COLOR, 4);
  }
  if (results.leftHandLandmarks) {
    drawDots(ctx, w, h, results.leftHandLandmarks, HAND_COLOR, 2.5);
  }
  if (results.rightHandLandmarks) {
    drawDots(ctx, w, h, results.rightHandLandmarks, HAND_COLOR, 2.5);
  }
}
