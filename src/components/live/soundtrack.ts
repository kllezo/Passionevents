/**
 * "Afterglow" — an original Passion Live soundtrack, synthesised live in the
 * browser with the Web Audio API (no recordings, no licensed music).
 *
 * 118 BPM, A minor, i–VI–III–VII (Am · F · C · G), 40 bars that loop:
 *   bars  0–7   intro  — pads, hats and a soft arpeggio
 *   bars  8–15  build  — kick and bass arrive, the filter opens, a riser
 *   bars 16–31  drop   — full kit, claps, bright arpeggio
 *   bars 32–39  break  — pads and arpeggio float, then a riser back in
 *
 * A look-ahead scheduler queues notes ~120 ms ahead on the audio clock, so
 * timing stays tight even when the page is busy animating.
 */

const BPM = 118;
const STEP = 60 / BPM / 4; // a 16th note
const BARS = 40;
export const TRACK_LENGTH = BARS * 16 * STEP; // seconds
export const TRACK_TITLE = "Afterglow";

// chord per two bars: [bass root Hz, triad Hz…]
const CHORDS: [number, number[]][] = [
  [55.0, [220.0, 261.63, 329.63]], // Am
  [43.65, [174.61, 220.0, 261.63]], // F
  [65.41, [261.63, 329.63, 392.0]], // C
  [49.0, [196.0, 246.94, 293.66]], // G
];

type Section = "intro" | "build" | "drop" | "break";
const sectionOf = (bar: number): Section => (bar < 8 ? "intro" : bar < 16 ? "build" : bar < 32 ? "drop" : "break");

export class Soundtrack {
  private ctx: AudioContext;
  private bus: GainNode;
  private filter: BiquadFilterNode;
  private delay: DelayNode;
  private noiseBuf: AudioBuffer;
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private startedAt = 0;
  private pausedAt = 0;
  playing = false;

  constructor(ctx: AudioContext, out: AudioNode) {
    this.ctx = ctx;
    this.bus = ctx.createGain();
    this.bus.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 4;
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 18000;
    this.bus.connect(this.filter).connect(comp).connect(out);

    // shared echo for the arpeggio
    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = STEP * 3;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;
    this.delay.connect(fb).connect(this.delay);
    this.delay.connect(wet).connect(this.bus);

    this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  /** Seconds into the track (0 … TRACK_LENGTH). */
  position() {
    if (!this.playing) return this.pausedAt % TRACK_LENGTH;
    return (this.ctx.currentTime - this.startedAt) % TRACK_LENGTH;
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    const now = this.ctx.currentTime;
    this.startedAt = now - this.pausedAt;
    this.step = Math.floor(this.pausedAt / STEP);
    this.nextTime = now + 0.05;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setTargetAtTime(0.9, now, 0.4);
    this.tick();
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    this.pausedAt = this.ctx.currentTime - this.startedAt;
    const now = this.ctx.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setTargetAtTime(0, now, 0.12);
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
  }

  dispose() {
    this.pause();
  }

  private tick = () => {
    if (!this.playing) return;
    while (this.nextTime < this.ctx.currentTime + 0.12) {
      this.schedule(this.step, this.nextTime);
      this.nextTime += STEP;
      this.step++;
    }
    this.timer = window.setTimeout(this.tick, 25);
  };

  private schedule(n: number, t: number) {
    const s = n % (BARS * 16);
    const bar = Math.floor(s / 16);
    const pos = s % 16; // 16th within the bar
    const sec = sectionOf(bar);
    const [root, triad] = CHORDS[Math.floor(bar / 2) % CHORDS.length];

    // filter: closed in the intro, opens through the build, wide in the drop
    if (pos === 0) {
      const cut = sec === "intro" ? 1800 : sec === "build" ? 1800 + ((bar - 8) / 8) * 14000 : sec === "drop" ? 17000 : 3200;
      this.filter.frequency.setTargetAtTime(cut, t, 0.6);
    }

    // pads: a new chord every two bars
    if (pos === 0 && bar % 2 === 0) this.pad(triad, t, STEP * 32, sec === "drop" ? 0.05 : 0.07);

    // kick: four on the floor in build and drop
    if ((sec === "build" || sec === "drop") && pos % 4 === 0) this.kick(t);
    // claps on 2 and 4 in the drop (and the last bar of the build)
    if ((sec === "drop" || bar === 15) && (pos === 4 || pos === 12)) this.clap(t);
    // build snare roll in its final bar
    if (bar === 15 && pos >= 8) this.clap(t, 0.25 + (pos - 8) * 0.04);
    // hats: off-beats everywhere, 16ths in the drop
    if (pos % 4 === 2) this.hat(t, 0.11, true);
    else if (sec === "drop" && pos % 2 === 1) this.hat(t, 0.05, false);

    // bass: off-beat pulse once the kick arrives
    if ((sec === "build" || sec === "drop") && (pos % 4 === 2 || (sec === "drop" && pos % 4 === 3))) this.bass(root, t);

    // arpeggio: chord tones climbing in 16ths
    if (sec !== "build" || bar >= 12) {
      const order = [0, 1, 2, 1, 0, 2, 1, 2];
      const note = triad[order[pos % order.length]] * (pos % 8 >= 4 ? 2 : 1);
      if (pos % 2 === 0 || sec === "drop") this.pluck(note, t, sec === "drop" ? 0.09 : 0.06);
    }

    // risers into the drop and back into the loop
    if ((bar === 14 || bar === 38) && pos === 0) this.riser(t, STEP * 32);
    // crash on the downbeat of the drop
    if (bar === 16 && pos === 0) this.crash(t);
  }

  private env(g: GainNode, t: number, peak: number, attack: number, release: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  }

  private kick(t: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.18);
    this.env(g, t, 0.95, 0.004, 0.36);
    o.connect(g).connect(this.bus);
    o.start(t);
    o.stop(t + 0.45);
  }

  private noise(t: number, dur: number, type: BiquadFilterType, freq: number, peak: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    this.env(g, t, peak, 0.002, dur);
    src.connect(f).connect(g).connect(this.bus);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
    return { f, g };
  }

  private clap(t: number, peak = 0.32) {
    for (let i = 0; i < 3; i++) this.noise(t + i * 0.011, 0.12, "bandpass", 1500, peak * (1 - i * 0.2));
  }

  private hat(t: number, peak: number, open: boolean) {
    this.noise(t, open ? 0.11 : 0.035, "highpass", 8200, peak);
  }

  private crash(t: number) {
    this.noise(t, 1.6, "highpass", 5000, 0.16);
  }

  private riser(t: number, dur: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 3;
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(9000, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
    src.connect(f).connect(g).connect(this.bus);
    src.start(t);
    src.stop(t + dur + 0.1);
  }

  private bass(root: number, t: number) {
    const o = this.ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = root;
    const sub = this.ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = root;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(180, t + 0.16);
    const g = this.ctx.createGain();
    this.env(g, t, 0.34, 0.005, 0.18);
    o.connect(f);
    sub.connect(f);
    f.connect(g).connect(this.bus);
    o.start(t);
    sub.start(t);
    o.stop(t + 0.25);
    sub.stop(t + 0.25);
  }

  private pluck(freq: number, t: number, peak: number) {
    const o = this.ctx.createOscillator();
    o.type = "square";
    o.frequency.value = freq;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(3200, t);
    f.frequency.exponentialRampToValueAtTime(600, t + 0.2);
    const g = this.ctx.createGain();
    this.env(g, t, peak, 0.004, 0.22);
    o.connect(f).connect(g);
    g.connect(this.bus);
    g.connect(this.delay);
    o.start(t);
    o.stop(t + 0.3);
  }

  private pad(triad: number[], t: number, dur: number, peak: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.9);
    g.gain.setValueAtTime(peak, t + dur - 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.4);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1400;
    f.Q.value = 2;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.18;
    const depth = this.ctx.createGain();
    depth.gain.value = 600;
    lfo.connect(depth).connect(f.frequency);
    f.connect(g).connect(this.bus);
    lfo.start(t);
    lfo.stop(t + dur + 0.5);
    for (const hz of triad) {
      for (const det of [-7, 7]) {
        const o = this.ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = hz / 2;
        o.detune.value = det;
        o.connect(f);
        o.start(t);
        o.stop(t + dur + 0.5);
      }
    }
  }
}
