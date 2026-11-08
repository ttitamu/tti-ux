import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import TuxScheduleMatrix from "~/components/TuxScheduleMatrix.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxScheduleMatrix Component", () => {
  function createGrid(rows = 7, cols = 8, initial = false): boolean[][] {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => initial));
  }

  it("renders 7x8 matrix, descriptive cell aria-labels, ratio summary, and passes axe audit", async () => {
    const grid = createGrid(7, 8, false);
    // Activate 30 slots (e.g. first 3 rows = 24 + 6 in row 3 = 30 of 56 = 53.6%)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) grid[r]![c] = true;
    }
    for (let c = 0; c < 6; c++) grid[3]![c] = true;

    const wrapper = await mountSuspended(TuxScheduleMatrix, {
      props: {
        modelValue: grid,
      },
    });

    expect(wrapper.classes()).toContain("tux-schedule-matrix");
    expect(wrapper.find(".tux-schedule-matrix__summary").text()).toBe(
      "30 of 56 slots active (53.6%)",
    );

    const activeCell = wrapper.find('button[data-cell="0-3"]');
    expect(activeCell.attributes("aria-label")).toBe("Mon 09–12: Active");
    expect(activeCell.attributes("aria-pressed")).toBe("true");

    const standbyCell = wrapper.find('button[data-cell="6-7"]');
    expect(standbyCell.attributes("aria-label")).toBe("Sun 21–24: Standby");
    expect(standbyCell.attributes("aria-pressed")).toBe("false");

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("emits updated grid when cells, row headers, column headers, and presets are clicked", async () => {
    const grid = createGrid(7, 8, false);
    const wrapper = await mountSuspended(TuxScheduleMatrix, {
      props: {
        modelValue: grid,
      },
    });

    // 1. Toggle individual cell (Mon 09–12 -> row 0, col 3)
    await wrapper.find('button[data-cell="0-3"]').trigger("click");
    const cellEmit = wrapper.emitted("update:modelValue")?.[0]?.[0] as boolean[][];
    expect(cellEmit[0]![3]).toBe(true);
    expect(cellEmit[0]![0]).toBe(false);

    // 2. Toggle row header (Tue -> row 1)
    const rowHeaders = wrapper.findAll("button.tux-schedule-matrix__row-header");
    await rowHeaders[1]!.trigger("click");
    const rowEmit = wrapper.emitted("update:modelValue")?.[1]?.[0] as boolean[][];
    expect(rowEmit[1]!.every(Boolean)).toBe(true);
    expect(rowEmit[0]!.every(Boolean)).toBe(false);

    // 3. Toggle column header (06–09 -> col 2)
    const colHeaders = wrapper.findAll("button.tux-schedule-matrix__col-header");
    await colHeaders[2]!.trigger("click");
    const colEmit = wrapper.emitted("update:modelValue")?.[2]?.[0] as boolean[][];
    expect(colEmit.every((row) => row[2] === true)).toBe(true);

    // 4. Presets: Weekdays Daytime, 24×7 Active, Off-Peak / Nights, Clear All
    const presets = wrapper.findAll("button.tux-schedule-matrix__preset");
    expect(presets.map((b) => b.text())).toEqual([
      "Weekdays Daytime",
      "24×7 Active",
      "Off-Peak / Nights",
      "Clear All",
    ]);

    await presets[0]!.trigger("click");
    const weekdayEmit = wrapper.emitted("update:modelValue")?.[3]?.[0] as boolean[][];
    expect(weekdayEmit[0]![2]).toBe(true); // Mon 06–09 active
    expect(weekdayEmit[0]![0]).toBe(false); // Mon 00–03 standby
    expect(weekdayEmit[5]![3]).toBe(false); // Sat 09–12 standby

    await presets[1]!.trigger("click");
    const allEmit = wrapper.emitted("update:modelValue")?.[4]?.[0] as boolean[][];
    expect(allEmit.flat().every(Boolean)).toBe(true);

    await presets[3]!.trigger("click");
    const clearEmit = wrapper.emitted("update:modelValue")?.[5]?.[0] as boolean[][];
    expect(clearEmit.flat().some(Boolean)).toBe(false);
  });
});
