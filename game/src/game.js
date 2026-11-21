// game.js — the hunt itself: state machine, clicks, timer, hints, scoring,
// keyboard play and the overlay screens. Rendering lives in render.js.
import { LEVELS } from './levels.js';
import { StageRenderer } from './render.js';
import { SoundBank } from './audio.js';

const $ = (id) => document.getElementById(id);

export class SpotDifferenceGame {
  constructor(canvas) {
    this.renderer = new StageRenderer(canvas);
    this.canvas = canvas;
    this.sounds = new SoundBank();
    this.best = Number(localStorage.getItem('lanternHarborBest') || 0);
    this.resetRun();
    this.phase = 'title';
    this.shotMode = false;
    this.bindControls();
    this.buildLevelPicker();
    this.showTitle();
    this.loop();
  }

  resetRun() {
    this.levelIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.startLevel(0);
  }

  startLevel(index) {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.found = new Set();
    this.hintsLeft = 3;
    this.timeLeft = this.level.timeLimit;
    this.misses = [];
    this.popups = [];
    this.hint = null;
    this.phase = 'playing';
    this.statusLine = '';
    this.lastTick = performance.now();
    this.renderer.buildScene(this.level.id);
    this.updateHud();
  }

  // -- HUD ---------------------------------------------------------------
  updateHud() {
    $('levelName').textContent = `Level ${this.level.id} · ${this.level.name}`;
    $('foundCounter').innerHTML = `Found <b>${this.found.size} / ${this.level.diffs.length}</b>`;
    const t = Math.max(0, Math.ceil(this.timeLeft));
    $('timer').textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    $('timer').classList.toggle('low', t <= 30 && this.phase === 'playing');
    $('scoreBox').innerHTML = `Score <b>${this.score}</b>`;
    const hintBtn = $('hintBtn');
    hintBtn.textContent = `💡 Hint (${this.hintsLeft})`;
    hintBtn.disabled = this.hintsLeft <= 0 || this.phase !== 'playing';
  }

  // -- main loop ---------------------------------------------------------
  loop() {
    const step = (now) => {
      if (this.phase === 'playing' && !this.shotMode) {
        const dt = (now - this.lastTick) / 1000;
        this.lastTick = now;
        this.timeLeft -= dt;
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.updateHud();
          this.gameOver();
        } else {
          this.updateHud();
        }
      }
      this.renderer.draw(this);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // -- input -------------------------------------------------------------
  bindControls() {
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    $('hintBtn').addEventListener('click', () => this.useHint());
    $('muteBtn').addEventListener('click', () => {
      this.sounds.ensure();
      const muted = this.sounds.toggleMute();
      $('muteBtn').textContent = muted ? '🔇 Muted' : '🔊 Sound';
    });
    $('restartBtn').addEventListener('click', () => {
      this.sounds.ensure();
      this.sounds.click();
      this.startLevel(this.levelIndex);
      this.hideOverlays();
    });
    $('playBtn').addEventListener('click', () => this.startPlay());
    $('nextBtn').addEventListener('click', () => this.nextLevel());
    $('retryBtn').addEventListener('click', () => {
      this.hideOverlays();
      this.startLevel(this.levelIndex);
    });
    $('againBtn').addEventListener('click', () => {
      this.hideOverlays();
      this.resetRun();
      this.showTitle();
    });
    document.addEventListener('keydown', (e) => this.onKey(e));
  }

  buildLevelPicker() {
    const pick = $('levelPick');
    LEVELS.forEach((level, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = `${level.id}. ${level.name} (${level.diffs.length} diffs)`;
      b.addEventListener('click', () => {
        this.sounds.ensure();
        this.sounds.click();
        this.levelIndex = i;
        this.startLevel(i);
        this.hideOverlays();
      });
      pick.appendChild(b);
    });
  }

  onKey(e) {
    if (e.key === 'm' || e.key === 'M') {
      $('muteBtn').click();
      return;
    }
    if (this.phase === 'title') {
      if (e.key >= '1' && e.key <= '3') {
        this.levelIndex = Number(e.key) - 1;
        this.startPlay();
      } else if (e.key === 'Enter') this.startPlay();
      return;
    }
    if (e.key === 'h' || e.key === 'H') this.useHint();
    else if (e.key === 'r' || e.key === 'R') {
      this.hideOverlays();
      this.startLevel(this.levelIndex);
    } else if (e.key === 'n' || e.key === 'N') {
      if (this.phase === 'levelDone') this.nextLevel();
    } else if (e.key >= '1' && e.key <= '3') {
      this.hideOverlays();
      this.startLevel(Number(e.key) - 1);
    } else if (e.key === 'Escape') this.showTitle();
  }

  startPlay() {
    this.sounds.ensure();
    this.sounds.click();
    this.hideOverlays();
    this.startLevel(this.levelIndex);
  }

  onClick(e) {
    if (this.phase !== 'playing' || this.shotMode) return;
    this.sounds.ensure();
    const rect = this.canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const py = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    const hit = this.renderer.panelAt(px, py);
    if (!hit) return;
    const found = this.level.diffs.findIndex(
      (d, i) => !this.found.has(i) && Math.hypot(d.x - hit.x, d.y - hit.y) <= d.r,
    );
    if (found >= 0) this.markFound(found, px, py);
    else this.markMiss(px, py);
  }

  markFound(index, px, py) {
    this.found.add(index);
    this.totalFound += 1;
    this.score += 100;
    this.sounds.found();
    this.popups.push({ text: '+100', x: px, y: py - 10, until: performance.now() + 900 });
    this.updateHud();
    if (this.found.size === this.level.diffs.length) this.levelComplete();
  }

  markMiss(px, py) {
    this.timeLeft = Math.max(0, this.timeLeft - 5);
    this.sounds.wrong();
    this.misses.push({ x: px, y: py, until: performance.now() + 500 });
    this.popups.push({ text: '−5s', x: px, y: py - 10, until: performance.now() + 900 });
    this.updateHud();
  }

  useHint() {
    if (this.phase !== 'playing' || this.hintsLeft <= 0 || this.shotMode) return;
    const next = this.level.diffs.findIndex((_, i) => !this.found.has(i));
    if (next < 0) return;
    this.sounds.ensure();
    this.sounds.hint();
    this.hintsLeft -= 1;
    this.timeLeft = Math.max(0, this.timeLeft - 10);
    this.hint = { index: next, until: performance.now() + 2500 };
    this.updateHud();
  }

  // -- endings -----------------------------------------------------------
  levelComplete() {
    const bonus = Math.round(this.timeLeft) * 2;
    this.score += bonus;
    this.sounds.sceneClear();
    const stars = this.timeLeft > this.level.timeLimit * 0.5 ? '★★★'
      : this.timeLeft > this.level.timeLimit * 0.25 ? '★★☆' : '★☆☆';
    $('levelStars').textContent = stars;
    $('levelTitle').textContent =
      this.levelIndex + 1 < LEVELS.length ? `${this.level.name} Complete!` : 'All Scenes Complete!';
    $('levelStats').innerHTML =
      `You found all <b>${this.level.diffs.length}</b> differences with ` +
      `<b>${Math.round(this.timeLeft)}s</b> to spare — time bonus <b>+${bonus}</b>.<br>` +
      `Total score: <b>${this.score}</b>` +
      (this.levelIndex + 1 < LEVELS.length
        ? `<br>Next up: <b>${LEVELS[this.levelIndex + 1].name}</b> — ${LEVELS[this.levelIndex + 1].diffs.length} differences.`
        : '');
    $('nextBtn').textContent = this.levelIndex + 1 < LEVELS.length ? 'Next Scene ▶' : 'See Your Results ▶';
    this.phase = 'levelDone';
    this.statusLine = 'Scene complete — every difference found!';
    this.hideOverlays();
    $('levelOverlay').hidden = false;
    this.updateHud();
  }

  nextLevel() {
    this.hideOverlays();
    if (this.levelIndex + 1 < LEVELS.length) {
      this.startLevel(this.levelIndex + 1);
    } else {
      this.victory();
    }
  }

  gameOver() {
    this.phase = 'gameOver';
    this.statusLine = 'Out of time — the lanterns burned down.';
    $('overStats').innerHTML =
      `You found <b>${this.found.size} / ${this.level.diffs.length}</b> differences in ` +
      `<b>${this.level.name}</b>.<br>Score so far: <b>${this.score}</b>. ` +
      `The ${this.level.diffs.length - this.found.size} still hiding: ` +
      this.level.diffs.filter((_, i) => !this.found.has(i)).map((d) => d.label).join(', ') + '.';
    this.hideOverlays();
    $('overOverlay').hidden = false;
    this.updateHud();
  }

  victory() {
    this.phase = 'victory';
    const isBest = this.score > this.best;
    if (isBest) {
      this.best = this.score;
      localStorage.setItem('lanternHarborBest', String(this.best));
    }
    this.sounds.victory();
    $('winStats').innerHTML =
      `All <b>${this.totalFound}</b> differences found across 3 scenes.<br>` +
      `Final score: <b>${this.score}</b>${isBest ? ' — a new best!' : ` (best: ${this.best})`}.`;
    this.hideOverlays();
    $('winOverlay').hidden = false;
    this.updateHud();
  }

  // -- overlays ----------------------------------------------------------
  hideOverlays() {
    ['titleOverlay', 'levelOverlay', 'overOverlay', 'winOverlay'].forEach((id) => {
      $(id).hidden = true;
    });
  }

  showTitle() {
    this.phase = 'title';
    this.statusLine = 'Pick a scene and start the hunt.';
    this.renderer.buildScene(this.level.id);
    this.hideOverlays();
    $('titleOverlay').hidden = false;
  }

  // -- screenshot mode ---------------------------------------------------
  // ?shot=<level>&found=0,2,4&hint=<index>&state=done
  // Used only to take the entry's own screenshots: it stages a real mid-game
  // state (timer frozen, overlays as played) and renders it.
  applyShotMode(params) {
    const level = Math.min(3, Math.max(1, Number(params.get('shot') || 1)));
    this.shotMode = true;
    this.hideOverlays();
    this.startLevel(level - 1);
    this.phase = 'playing';
    const found = (params.get('found') || '')
      .split(',').filter(Boolean).map(Number)
      .filter((i) => i >= 0 && i < this.level.diffs.length);
    found.forEach((i) => this.found.add(i));
    this.score = found.length * 100;
    this.timeLeft = 154; // 02:34 on the clock
    const hintIndex = Number(params.get('hint'));
    if (Number.isInteger(hintIndex) && hintIndex >= 0 && !this.found.has(hintIndex)) {
      this.hint = { index: hintIndex, until: performance.now() + 3600000 };
    }
    if (params.get('state') === 'done') {
      this.found = new Set(this.level.diffs.map((_, i) => i));
      this.score = this.level.diffs.length * 100 + 240;
      this.timeLeft = 120;
      this.levelComplete();
    }
    this.updateHud();
    this.renderer.draw(this);
  }
}
