// render.js — draws the two pictures, the found markers, hint pulses and
// miss flashes onto the stage canvas. Panels are painted once per scene
// into offscreen canvases, so the main loop only composites and decorates.
import { paintScene } from './scenes.js';

export const PANEL_W = 560;
export const PANEL_H = 420;
export const LEFT_X = 40;
export const RIGHT_X = 680;
export const PANEL_Y = 30;

export class StageRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.g = canvas.getContext('2d');
    this.panels = [null, null];
    this.sceneId = 0;
  }

  // Paint both pictures fresh for a scene (left = variant 0, right = 1).
  buildScene(sceneId) {
    this.sceneId = sceneId;
    this.panels = [0, 1].map((variant) => {
      const off = document.createElement('canvas');
      off.width = PANEL_W;
      off.height = PANEL_H;
      paintScene(off.getContext('2d'), sceneId, variant);
      return off;
    });
  }

  panelAt(px, py) {
    if (py < PANEL_Y || py > PANEL_Y + PANEL_H) return null;
    if (px >= LEFT_X && px <= LEFT_X + PANEL_W) return { side: 0, x: px - LEFT_X, y: py - PANEL_Y };
    if (px >= RIGHT_X && px <= RIGHT_X + PANEL_W) return { side: 1, x: px - RIGHT_X, y: py - PANEL_Y };
    return null;
  }

  draw(state) {
    const g = this.g;
    g.clearRect(0, 0, 1280, 560);
    g.fillStyle = '#0a1122';
    g.fillRect(0, 0, 1280, 560);

    // Panel frames and labels.
    [LEFT_X, RIGHT_X].forEach((x, i) => {
      g.fillStyle = '#f4ead2';
      g.font = 'bold 15px "Trebuchet MS", sans-serif';
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      g.fillText(i === 0 ? 'PICTURE A' : 'PICTURE B', x, 22);
      g.strokeStyle = '#3c5a86';
      g.lineWidth = 3;
      g.strokeRect(x - 3, PANEL_Y - 3, PANEL_W + 6, PANEL_H + 6);
      if (this.panels[i]) g.drawImage(this.panels[i], x, PANEL_Y);
    });

    const level = state.level;
    const now = performance.now();

    // Hint pulse: a golden ring breathing over the hinted difference.
    if (state.hint && now < state.hint.until) {
      const d = level.diffs[state.hint.index];
      const pulse = 1 + 0.18 * Math.sin((now / 160) % (Math.PI * 2));
      [LEFT_X, RIGHT_X].forEach((x) => {
        g.strokeStyle = 'rgba(255, 217, 122, 0.95)';
        g.lineWidth = 4;
        g.beginPath();
        g.arc(x + d.x, PANEL_Y + d.y, d.r * pulse + 6, 0, Math.PI * 2);
        g.stroke();
      });
    }

    // Found markers: a green ring plus a check on both pictures.
    state.found.forEach((index) => {
      const d = level.diffs[index];
      [LEFT_X, RIGHT_X].forEach((x) => {
        const cx = x + d.x;
        const cy = PANEL_Y + d.y;
        g.strokeStyle = '#37d67a';
        g.lineWidth = 5;
        g.beginPath();
        g.arc(cx, cy, d.r + 5, 0, Math.PI * 2);
        g.stroke();
        g.strokeStyle = 'rgba(55, 214, 122, 0.35)';
        g.lineWidth = 9;
        g.beginPath();
        g.arc(cx, cy, d.r + 10, 0, Math.PI * 2);
        g.stroke();
        // Check mark.
        g.strokeStyle = '#37d67a';
        g.lineWidth = 5;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(cx - 9, cy);
        g.lineTo(cx - 2, cy + 8);
        g.lineTo(cx + 11, cy - 8);
        g.stroke();
      });
    });

    // Miss flashes: a red X where a wrong click landed, fading fast.
    state.misses = state.misses.filter((m) => now < m.until);
    state.misses.forEach((m) => {
      const alpha = Math.max(0, (m.until - now) / 500);
      g.strokeStyle = `rgba(255, 90, 80, ${alpha})`;
      g.lineWidth = 4;
      g.lineCap = 'round';
      const s = 10;
      g.beginPath();
      g.moveTo(m.x - s, m.y - s);
      g.lineTo(m.x + s, m.y + s);
      g.moveTo(m.x + s, m.y - s);
      g.lineTo(m.x - s, m.y + s);
      g.stroke();
    });

    // Floating score popups.
    state.popups = state.popups.filter((p) => now < p.until);
    state.popups.forEach((p) => {
      const alpha = Math.max(0, (p.until - now) / 900);
      g.fillStyle = `rgba(255, 217, 122, ${alpha})`;
      g.font = '900 24px "Trebuchet MS", sans-serif';
      g.textAlign = 'center';
      g.fillText(p.text, p.x, p.y - (1 - alpha) * 24);
    });

    // Progress dots: one per difference, filled green once found.
    const dotY = 500;
    const total = level.diffs.length;
    const span = Math.min(560, total * 34);
    const startX = 640 - span / 2;
    g.font = 'bold 15px "Trebuchet MS", sans-serif';
    g.fillStyle = '#aab8d4';
    g.textAlign = 'right';
    g.fillText('Differences:', startX - 14, dotY + 5);
    level.diffs.forEach((d, i) => {
      const cx = startX + i * 34 + 10;
      g.fillStyle = state.found.has(i) ? '#37d67a' : '#33415c';
      g.beginPath();
      g.arc(cx, dotY, 9, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = state.found.has(i) ? '#8fe6b0' : '#4d7ea8';
      g.lineWidth = 2;
      g.stroke();
      if (state.found.has(i)) {
        g.fillStyle = '#0a1122';
        g.font = 'bold 11px "Trebuchet MS", sans-serif';
        g.textAlign = 'center';
        g.fillText('✓', cx, dotY + 4);
      }
    });

    // Status line under the dots.
    g.fillStyle = '#f4ead2';
    g.font = '16px "Trebuchet MS", sans-serif';
    g.textAlign = 'center';
    const remaining = total - state.found.size;
    g.fillText(
      state.phase === 'playing'
        ? (remaining > 0 ? `${remaining} difference${remaining === 1 ? '' : 's'} still hiding — look closely!` : 'All found!')
        : state.statusLine,
      640,
      538,
    );
  }
}
