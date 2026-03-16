import { addEffect } from './manager.js';

const HOLD_FRAMES  = 4;     // consecutive frames required before triggering
const COOLDOWN_MS  = 2500;  // ms before the effect can fire again

let holdCount   = 0;
let lastTrigger = -Infinity;

/**
 * Returns true when the given hand landmarks form a thumbs-up:
 *   - thumb tip is above (lower y) the thumb MCP
 *   - all four fingers are curled (tips below their PIPs)
 */
function isThumbsUp(lm) {
  if (!lm || lm.length < 21) return false;
  if (lm[4].y >= lm[2].y) return false; // thumb not pointing up
  const fingers = [[8, 6], [12, 10], [16, 14], [20, 18]];
  for (const [tip, pip] of fingers) {
    if (lm[tip].y < lm[pip].y) return false; // finger not curled
  }
  return true;
}

/**
 * Call every frame with the current hand landmark arrays.
 * Fires a burst effect after HOLD_FRAMES consecutive detections,
 * then enforces a cooldown before re-triggering.
 */
export function processThumbsUp(leftHand, rightHand) {
  const detected = isThumbsUp(leftHand) || isThumbsUp(rightHand);

  if (detected) {
    holdCount++;
    if (holdCount >= HOLD_FRAMES) {
      const now = performance.now();
      if (now - lastTrigger > COOLDOWN_MS) {
        lastTrigger = now;
        holdCount   = 0;
        // Place burst at the thumb tip of whichever hand is showing thumbs up
        const hand  = isThumbsUp(leftHand) ? leftHand : rightHand;
        addEffect({ x: hand[4].x, y: hand[4].y });
      }
    }
  } else {
    holdCount = 0;
  }
}
