/**
 * Sugar Rush Gentle Audio Synthesizer Engine
 * Trilha sonora suave, doce e bem baixa no estilo caixinha de música encantada.
 */

class SugarRushAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;
  // Volume bem baixo e suave por padrão
  private volume: number = 0.12;
  private masterGain: GainNode | null = null;
  private tempo: number = 96; // Calmo, relaxante e suave

  private noteFreqs: { [note: string]: number } = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98,
    'REST': 0
  };

  // Melodia doce, alegre porém suave e relaxante estilo caixinha de música
  private melodyPattern: string[] = [
    'C5', 'E5', 'G5', 'E5', 'A5', 'G5', 'E5', 'REST',
    'D5', 'F5', 'A5', 'F5', 'G5', 'E5', 'C5', 'REST',
    'C5', 'E5', 'G5', 'C6', 'B5', 'G5', 'E5', 'REST',
    'A4', 'C5', 'E5', 'G5', 'D5', 'C5', 'C5', 'REST',
    'E5', 'G5', 'C6', 'E6', 'D6', 'B5', 'G5', 'REST',
    'F5', 'A5', 'C6', 'A5', 'G5', 'E5', 'D5', 'REST',
    'C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5',
    'D5', 'E5', 'D5', 'B4', 'C5', 'REST', 'REST', 'REST'
  ];

  // Baixo suave e aveludado em ondas senoidais
  private bassPattern: string[] = [
    'C4', 'REST', 'G4', 'REST', 'F4', 'REST', 'C4', 'REST',
    'A4', 'REST', 'E4', 'REST', 'G4', 'REST', 'C4', 'REST'
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(0.3, vol)); // Mantém o teto baixo e suave
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isSoundPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.scheduleNextTick();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  private scheduleNextTick() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const stepDuration = 60 / (this.tempo * 2);
    this.playStep(this.currentStep, this.ctx.currentTime);

    this.currentStep = (this.currentStep + 1) % this.melodyPattern.length;
    this.timerId = window.setTimeout(() => {
      this.scheduleNextTick();
    }, stepDuration * 1000);
  }

  private playStep(step: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // 1. Nota da melodia estilo caixinha de música (ondas senoidais com filtro quente)
    const melodyNote = this.melodyPattern[step];
    if (melodyNote && melodyNote !== 'REST') {
      const freq = this.noteFreqs[melodyNote];
      if (freq) {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine'; // Som puro, doce e aveludado
        osc.frequency.setValueAtTime(freq, time);

        // Envoltória macia
        oscGain.gain.setValueAtTime(0.08, time);
        oscGain.gain.exponentialRampToValueAtTime(0.0005, time + 0.35);

        // Harmônico delicado de celesta
        const shimmer = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(freq * 2, time);

        shimmerGain.gain.setValueAtTime(0.02, time);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        shimmer.connect(shimmerGain);
        shimmerGain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.38);

        shimmer.start(time);
        shimmer.stop(time + 0.2);
      }
    }

    // 2. Fundo harmônico suave (a cada 2 passos)
    if (step % 2 === 0) {
      const bassNote = this.bassPattern[(step / 2) % this.bassPattern.length];
      if (bassNote && bassNote !== 'REST') {
        const bassFreq = (this.noteFreqs[bassNote] || 220) / 2;
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, time);

        bassGain.gain.setValueAtTime(0.06, time);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);

        bassOsc.start(time);
        bassOsc.stop(time + 0.52);
      }
    }
  }

  // Efeitos sonoros opcionais
  public playRaceCountdownBeep(isGo: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isGo ? 660 : 380;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isGo ? 0.35 : 0.15));

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + (isGo ? 0.36 : 0.16));
  }

  public playEngineZoom() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';

    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.5);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.82);
  }

  public playPopSound() {
    // Som discreto para confetes
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const sugarRushAudio = new SugarRushAudioEngine();
