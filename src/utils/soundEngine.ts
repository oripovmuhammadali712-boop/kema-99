import { SoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundType: SoundType = 'thock';
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundType(type: SoundType) {
    this.soundType = type;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public play(isSpaceOrEnter: boolean = false) {
    if (this.soundType === 'off') return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Slight pitch variation (0.94 - 1.06) for organic feel
      const pitchVariation = 0.94 + Math.random() * 0.12;

      if (this.soundType === 'thock') {
        this.playThock(now, pitchVariation, isSpaceOrEnter);
      } else if (this.soundType === 'clicky') {
        this.playClicky(now, pitchVariation, isSpaceOrEnter);
      } else if (this.soundType === 'soft') {
        this.playSoft(now, pitchVariation, isSpaceOrEnter);
      }
    } catch {
      // AudioContext policy safe fallback
    }
  }

  // Deep resonant mechanical switch clack (Gateron Ink / Holy Panda)
  private playThock(now: number, pitch: number, isSpace: boolean) {
    if (!this.ctx) return;

    const baseFreq = (isSpace ? 110 : 160) * pitch;

    // Resonant oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 2.2, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isSpace ? 480 : 650, now);
    filter.Q.setValueAtTime(3.5, now);

    // Initial clack transient
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.volume * (isSpace ? 0.9 : 0.75), now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isSpace ? 0.075 : 0.055));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);

    // Second subtle sub-harmonic thump for the chassis
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime((isSpace ? 65 : 90) * pitch, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.06);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.003);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.065);
  }

  // Crisp mechanical click (Cherry MX Blue)
  private playClicky(now: number, pitch: number, isSpace: boolean) {
    if (!this.ctx) return;

    // High frequency snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime((isSpace ? 2200 : 2800) * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400 * pitch, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.6, now + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);

    // Bottom-out clack
    const bottomOsc = this.ctx.createOscillator();
    const bottomGain = this.ctx.createGain();
    bottomOsc.type = 'triangle';
    bottomOsc.frequency.setValueAtTime(320 * pitch, now);
    bottomOsc.frequency.exponentialRampToValueAtTime(90, now + 0.03);

    bottomGain.gain.setValueAtTime(0.001, now);
    bottomGain.gain.linearRampToValueAtTime(this.volume * 0.35, now + 0.002);
    bottomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    bottomOsc.connect(bottomGain);
    bottomGain.connect(this.ctx.destination);

    bottomOsc.start(now);
    bottomOsc.stop(now + 0.045);
  }

  // Soft membrane / bubble sound
  private playSoft(now: number, pitch: number, isSpace: boolean) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = (isSpace ? 350 : 500) * pitch;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const soundEngine = new SoundEngine();
