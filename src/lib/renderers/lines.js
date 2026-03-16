const FACE_DIM   = 'rgba(0, 220, 255, 0.12)';
const FACE_EDGE  = 'rgba(0, 220, 255, 0.85)';
const BODY_COLOR = 'rgba(0, 255, 140, 0.9)';
const HAND_COLOR = 'rgba(255, 60, 220, 0.9)';

function withGlow(ctx, color, blur, fn) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
  fn();
  ctx.restore();
}

// Batched draw — all lines share one colour (used for dense tesselation).
function drawLines(ctx, w, h, landmarks, connections, color, lineWidth) {
  if (!landmarks || !connections) return;
  ctx.strokeStyle = color;
  ctx.lineWidth   = lineWidth;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  for (const [a, b] of connections) {
    const p1 = landmarks[a];
    const p2 = landmarks[b];
    if (!p1 || !p2) continue;
    ctx.moveTo(p1.x * w, p1.y * h);
    ctx.lineTo(p2.x * w, p2.y * h);
  }
  ctx.stroke();
}

// Per-line depth draw — alpha and width scale with how close the landmark is.
// depthFn(z) → [0, 1] where 1 = closest to camera.
function drawLinesDepth(ctx, w, h, landmarks, connections, rgb, maxLw, depthFn) {
  if (!landmarks || !connections) return;
  ctx.lineCap = 'round';
  for (const [a, b] of connections) {
    const p1 = landmarks[a];
    const p2 = landmarks[b];
    if (!p1 || !p2) continue;
    const depth      = (depthFn(p1.z ?? 0) + depthFn(p2.z ?? 0)) / 2;
    const alpha      = 0.2 + depth * 0.8;
    ctx.strokeStyle  = `rgba(${rgb}, ${alpha.toFixed(2)})`;
    ctx.lineWidth    = maxLw * (0.35 + depth * 0.65);
    ctx.shadowBlur   = depth * 18;
    ctx.beginPath();
    ctx.moveTo(p1.x * w, p1.y * h);
    ctx.lineTo(p2.x * w, p2.y * h);
    ctx.stroke();
  }
}

// Depth functions — map each model's z range to [0, 1].
const faceDepth = (z) => Math.max(0, Math.min(1, -z / 0.12));
const poseDepth = (z) => Math.max(0, Math.min(1, (-z + 0.3) / 0.6));
const handDepth = (z) => Math.max(0, Math.min(1, -z / 0.08));

export function renderLines(canvas, results) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;

  // ── Face ──────────────────────────────────────────────────────────────────
  if (results.faceLandmarks?.length) {
    // Dense tesselation — batched for performance, no per-line depth.
    withGlow(ctx, FACE_EDGE, 4, () =>
      drawLines(ctx, w, h, results.faceLandmarks, FACEMESH_TESSELATION, FACE_DIM, 0.5)
    );

    // Feature lines — depth-aware (each drawn individually).
    ctx.save();
    ctx.shadowColor = FACE_EDGE;
    const featureGroups = [
      [FACEMESH_FACE_OVAL,     1.6],
      [FACEMESH_LEFT_EYE,      1.3],
      [FACEMESH_RIGHT_EYE,     1.3],
      [FACEMESH_LEFT_EYEBROW,  1.1],
      [FACEMESH_RIGHT_EYEBROW, 1.1],
      [FACEMESH_LIPS,          1.3],
    ];
    for (const [conn, lw] of featureGroups) {
      drawLinesDepth(ctx, w, h, results.faceLandmarks, conn, '0, 220, 255', lw, faceDepth);
    }
    ctx.restore();
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  if (results.poseLandmarks?.length) {
    ctx.save();
    ctx.shadowColor = BODY_COLOR;
    drawLinesDepth(ctx, w, h, results.poseLandmarks, POSE_CONNECTIONS, '0, 255, 140', 2.5, poseDepth);
    ctx.restore();
  }

  // ── Hands ─────────────────────────────────────────────────────────────────
  ctx.save();
  ctx.shadowColor = HAND_COLOR;
  if (results.leftHandLandmarks) {
    drawLinesDepth(ctx, w, h, results.leftHandLandmarks,  HAND_CONNECTIONS, '255, 60, 220', 1.8, handDepth);
  }
  if (results.rightHandLandmarks) {
    drawLinesDepth(ctx, w, h, results.rightHandLandmarks, HAND_CONNECTIONS, '255, 60, 220', 1.8, handDepth);
  }
  ctx.restore();
}
