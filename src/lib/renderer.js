import { renderLines   } from './renderers/lines.js';
import { renderDots    } from './renderers/dots.js';
import { renderAscii   } from './renderers/ascii.js';
import { renderMosaic  } from './renderers/mosaic.js';
import { renderLowPoly } from './renderers/lowpoly.js';
import { renderEffects } from './effects/manager.js';

const RENDERERS = {
  lines:   renderLines,
  dots:    renderDots,
  ascii:   renderAscii,
  mosaic:  renderMosaic,
  lowpoly: renderLowPoly,
};

export function render(canvas, results, mode = 'lines') {
  const ctx = canvas.getContext('2d');
  canvas.width  = results.image.width;
  canvas.height = results.image.height;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  (RENDERERS[mode] ?? renderLines)(canvas, results);

  // Effects render on top of every mode.
  renderEffects(canvas);
}
