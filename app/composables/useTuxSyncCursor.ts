/**
 * useTuxSyncCursor — Synchronized Telemetry & Corridor Crosshair Bus
 *
 * Inspired by NASA OpenMCT and Linear telemetry scrubbing: links multiple
 * TUX visualizations (`TuxCorridorStrip`, `TuxActivityTimeline`, `TuxChartLine`,
 * `TuxUnitValue`) on a shared reactive channel so hovering or scrubbing a
 * highway milepost, engineering station, or timestamp highlights all connected
 * exhibits simultaneously.
 */
import { computed, readonly, ref } from "vue";
import type { Ref } from "vue";
import { formatStationing } from "./useTuxUnits";

export interface TuxSyncCursorState {
  active: boolean;
  /** Highway milepost / Reference Marker (e.g. 240.5). */
  milepost: number | null;
  /** Civil-engineering stationing in feet (e.g. 1250 -> STA 12+50). */
  stationFeet: number | null;
  /** Timestamp or time label (e.g. "14:30" or ISO-8601). */
  timestamp: string | null;
  /** Linked timeline or sensor event ID. */
  eventId: string | null;
  /** Human-readable telemetry readout label. */
  label: string | null;
  /** Identifier of the component that originated the cursor update. */
  sourceId: string | null;
}

function createInitialState(): TuxSyncCursorState {
  return {
    active: false,
    milepost: null,
    stationFeet: null,
    timestamp: null,
    eventId: null,
    label: null,
    sourceId: null,
  };
}

const channelRegistry = new Map<string, Ref<TuxSyncCursorState>>();

function getChannelRef(channel: string): Ref<TuxSyncCursorState> {
  let stateRef = channelRegistry.get(channel);
  if (!stateRef) {
    stateRef = ref<TuxSyncCursorState>(createInitialState());
    channelRegistry.set(channel, stateRef);
  }
  return stateRef;
}

export function resetAllCursorChannels() {
  for (const stateRef of channelRegistry.values()) {
    stateRef.value = createInitialState();
  }
}

export function useTuxSyncCursor(channel = "default") {
  const state = getChannelRef(channel);

  function setCursor(patch: Partial<Omit<TuxSyncCursorState, "active">>) {
    const nextMile = patch.milepost !== undefined ? patch.milepost : state.value.milepost;
    const nextStation =
      patch.stationFeet !== undefined
        ? patch.stationFeet
        : nextMile != null
          ? Math.round(nextMile * 5280)
          : state.value.stationFeet;

    state.value = {
      active: true,
      milepost: nextMile ?? null,
      stationFeet: nextStation ?? null,
      timestamp: patch.timestamp !== undefined ? patch.timestamp : state.value.timestamp,
      eventId: patch.eventId !== undefined ? patch.eventId : state.value.eventId,
      label: patch.label !== undefined ? patch.label : state.value.label,
      sourceId: patch.sourceId !== undefined ? patch.sourceId : state.value.sourceId,
    };
  }

  function setMilepost(milepost: number, label?: string, sourceId?: string) {
    setCursor({
      milepost: Math.round(milepost * 100) / 100,
      stationFeet: Math.round(milepost * 5280),
      label: label ?? `RM ${milepost.toFixed(1)}`,
      sourceId: sourceId ?? null,
    });
  }

  function setTimestamp(
    timestamp: string,
    options?: { eventId?: string; milepost?: number; label?: string; sourceId?: string },
  ) {
    setCursor({
      timestamp,
      eventId: options?.eventId ?? null,
      milepost: options?.milepost ?? state.value.milepost,
      label: options?.label ?? timestamp,
      sourceId: options?.sourceId ?? null,
    });
  }

  function clearCursor() {
    state.value = createInitialState();
  }

  const formattedStation = computed(() => {
    if (state.value.stationFeet == null) return null;
    return formatStationing(state.value.stationFeet, 0);
  });

  const formattedReferenceMarker = computed(() => {
    if (state.value.milepost == null) return null;
    return `RM ${state.value.milepost}`;
  });

  return {
    channel,
    cursor: readonly(state),
    formattedStation,
    formattedReferenceMarker,
    setCursor,
    setMilepost,
    setTimestamp,
    clearCursor,
  };
}
