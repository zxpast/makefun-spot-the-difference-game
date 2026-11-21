// SoundBank — every sound is synthesized live with WebAudio oscillators.
// No audio files, no network: the game stays fully offline.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // A short tone that slides from freqA to freqB.
  tone(freqA, freqB, seconds, type, volume, when = 0) {
    if (this.muted || !this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqA, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqB), t0 + seconds);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + seconds + 0.02);
  }

  // Satisfying two-note chime when a difference is found.
  found() {
    this.tone(660, 660, 0.12, 'sine', 0.22);
    this.tone(880, 990, 0.22, 'sine', 0.22, 0.09);
    this.tone(1320, 1320, 0.3, 'triangle', 0.1, 0.09);
  }

  // Dull buzz for a wrong click.
  wrong() {
    this.tone(160, 90, 0.25, 'sawtooth', 0.14);
  }

  // Soft pop for a hint.
  hint() {
    this.tone(520, 780, 0.16, 'sine', 0.16);
  }

  // Little click for buttons.
  click() {
    this.tone(440, 440, 0.06, 'square', 0.08);
  }

  // Rising arpeggio when a scene is cleared.
  sceneClear() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, f, 0.22, 'triangle', 0.18, i * 0.11));
  }

  // Long fanfare for finishing all three scenes.
  victory() {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
      this.tone(f, f, 0.28, 'triangle', 0.18, i * 0.13));
  }
}
