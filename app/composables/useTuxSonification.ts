/**
 * useTuxSonification — Web Audio API acoustic data sonification engine
 * for TUX visualizations and TTI telemetry exhibits.
 *
 * Maps numeric data series onto an ergonomic frequency spectrum (220 Hz A3
 * to 880 Hz A5) with stereo spatial panning (-0.75 left to +0.75 right)
 * across the category/time axis, accompanied by an ARIA live-region
 * statistical summary for screen-reader and low-vision users.
 */
import { ref } from "vue";

export interface TuxSonificationSeries {
  key?: string;
  label: string;
  data: number[];
  unit?: string;
}

export interface TuxSeriesStats {
  count: number;
  min: number;
  max: number;
  mean: number;
  minLabel: string;
  maxLabel: string;
  delta: number;
  trend: "rising" | "falling" | "stable";
  summary: string;
}

/**
 * Maps a normalized value [0, 1] to a frequency in Hz between minHz and maxHz
 * using an exponential (musical octave) pitch scale.
 */
export function valueToFrequency(
  value: number,
  min: number,
  max: number,
  minHz = 220,
  maxHz = 880,
): number {
  if (!Number.isFinite(value)) return minHz;
  const span = max - min;
  const normalized = span <= 0 ? 0.5 : Math.min(1, Math.max(0, (value - min) / span));
  const octaves = Math.log2(maxHz / minHz);
  return Math.round(minHz * Math.pow(2, normalized * octaves) * 100) / 100;
}

/**
 * Maps a point index [0, length - 1] to stereo pan [-0.75, +0.75].
 */
export function indexToStereoPan(index: number, length: number): number {
  if (length <= 1) return 0;
  const normalized = index / (length - 1);
  return Math.round((-0.75 + normalized * 1.5) * 100) / 100;
}

/**
 * Computes deterministic descriptive statistics and an accessible plain-language
 * summary for a data series.
 */
export function computeSeriesStats(
  series: TuxSonificationSeries,
  labels: string[] = [],
): TuxSeriesStats {
  const clean = series.data.filter((v) => Number.isFinite(v));
  if (clean.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      mean: 0,
      minLabel: "",
      maxLabel: "",
      delta: 0,
      trend: "stable",
      summary: `${series.label}: No numeric data points available.`,
    };
  }

  let min = clean[0]!;
  let max = clean[0]!;
  let minIdx = 0;
  let maxIdx = 0;
  let sum = 0;

  series.data.forEach((v, idx) => {
    if (!Number.isFinite(v)) return;
    sum += v;
    if (v < min) {
      min = v;
      minIdx = idx;
    }
    if (v > max) {
      max = v;
      maxIdx = idx;
    }
  });

  const mean = Math.round((sum / clean.length) * 100) / 100;
  const first = clean[0]!;
  const last = clean[clean.length - 1]!;
  const delta = Math.round((last - first) * 100) / 100;
  const threshold = (max - min) * 0.05;
  const trend: "rising" | "falling" | "stable" =
    delta > threshold ? "rising" : delta < -threshold ? "falling" : "stable";

  const minLabel = labels[minIdx] || `Point ${minIdx + 1}`;
  const maxLabel = labels[maxIdx] || `Point ${maxIdx + 1}`;
  const unitSuffix = series.unit ? ` ${series.unit}` : "";

  const summary =
    `${series.label} (${clean.length} points, ${trend} trend): ` +
    `peak ${max}${unitSuffix} at ${maxLabel}, ` +
    `low ${min}${unitSuffix} at ${minLabel}, ` +
    `mean ${mean}${unitSuffix}.`;

  return {
    count: clean.length,
    min,
    max,
    mean,
    minLabel,
    maxLabel,
    delta,
    trend,
    summary,
  };
}

export function useTuxSonification() {
  const isPlaying = ref(false);
  const activePointIndex = ref<number | null>(null);
  const activeFrequencyHz = ref<number | null>(null);
  const liveAnnouncement = ref("");

  let activeTimers: ReturnType<typeof setTimeout>[] = [];
  let audioCtx: AudioContext | null = null;

  function stop() {
    for (const timer of activeTimers) {
      clearTimeout(timer);
    }
    activeTimers = [];
    isPlaying.value = false;
    activePointIndex.value = null;
    activeFrequencyHz.value = null;
    if (audioCtx && audioCtx.state !== "closed") {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    }
  }

  function playSeries(
    series: TuxSonificationSeries,
    labels: string[] = [],
    options: { noteDurationMs?: number } = {},
  ): TuxSeriesStats {
    stop();

    const stats = computeSeriesStats(series, labels);
    liveAnnouncement.value = `Playing acoustic sonification — ${stats.summary}`;

    if (stats.count === 0) {
      return stats;
    }

    const noteDurationMs = options.noteDurationMs ?? 180;
    isPlaying.value = true;

    // Attempt Web Audio API synthesis when available in browser runtime
    const AudioContextCtor =
      typeof window !== "undefined"
        ? window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        : undefined;

    if (AudioContextCtor) {
      try {
        audioCtx = new AudioContextCtor();
      } catch {
        audioCtx = null;
      }
    }

    const startTime = audioCtx ? audioCtx.currentTime + 0.03 : 0;
    const stepSec = noteDurationMs / 1000;

    series.data.forEach((val, idx) => {
      const freq = valueToFrequency(val, stats.min, stats.max);
      const pan = indexToStereoPan(idx, series.data.length);

      if (audioCtx) {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, startTime + idx * stepSec);

          const noteStart = startTime + idx * stepSec;
          const noteEnd = noteStart + stepSec * 0.85;
          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

          if (typeof audioCtx.createStereoPanner === "function") {
            const panner = audioCtx.createStereoPanner();
            panner.pan.setValueAtTime(pan, noteStart);
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(audioCtx.destination);
          } else {
            osc.connect(gain);
            gain.connect(audioCtx.destination);
          }

          osc.start(noteStart);
          osc.stop(noteEnd + 0.01);
        } catch {
          // Ignore individual Web Audio scheduling errors in restricted environments
        }
      }

      const timer = setTimeout(() => {
        activePointIndex.value = idx;
        activeFrequencyHz.value = freq;
      }, idx * noteDurationMs);
      activeTimers.push(timer);
    });

    const endTimer = setTimeout(() => {
      isPlaying.value = false;
      activePointIndex.value = null;
      activeFrequencyHz.value = null;
    }, series.data.length * noteDurationMs + 60);
    activeTimers.push(endTimer);

    return stats;
  }

  return {
    isPlaying,
    activePointIndex,
    activeFrequencyHz,
    liveAnnouncement,
    playSeries,
    stop,
    computeSeriesStats,
  };
}
