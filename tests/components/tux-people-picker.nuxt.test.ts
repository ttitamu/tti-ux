// @vitest-environment nuxt
/**
 * TuxPeoplePicker — the interaction contract the forge's Roadmap item
 * panel depends on: APG combobox keyboard (arrows wrap, Home/End, Enter
 * toggles, Escape emits close and never reaches the enclosing <dialog>),
 * disabled people are unpickable, remote mode never filters, single
 * select replaces, and selected-first ordering that does not jump
 * mid-pick. The pure helpers are locked in tests/tux-people.test.ts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxPeoplePicker from "../../app/components/TuxPeoplePicker.vue";
import type { TuxPerson } from "../../app/utils/tuxPeople";

const people: TuxPerson[] = [
  { id: "arojo", name: "Rojo, Alex", subtitle: "Student Technician · NET" },
  { id: "lnguyen", name: "Nguyen, Linh", subtitle: "Systems Administrator II · NIS" },
  {
    id: "tkaur",
    name: "Kaur, Tanvir",
    subtitle: "Graduate Research Assistant · Mobility",
    status: { label: "Needs access", tone: "warning" },
    disabled: true,
  },
  { id: "spena", name: "Peña, Sofía", subtitle: "Program Manager · Transit Mobility" },
];

afterEach(() => {
  document.body.innerHTML = "";
});

async function mountPicker(props: Record<string, unknown> = {}) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  return mountSuspended(TuxPeoplePicker, {
    props: { people, modelValue: [], autofocus: false, ...props },
    attachTo: host,
  });
}

type Wrapper = Awaited<ReturnType<typeof mountPicker>>;

const input = (w: Wrapper) => w.find("input");
const names = (w: Wrapper) =>
  w.findAll('[role="option"]').map((o) => o.find(".tux-people-picker__name").text());
const activeName = (w: Wrapper) => {
  const id = input(w).attributes("aria-activedescendant");
  if (!id) return null;
  return w.find(`[id="${id}"]`).find(".tux-people-picker__name").text();
};
const press = (w: Wrapper, key: string, init: KeyboardEventInit = {}) =>
  input(w).trigger("keydown", { key, ...init });

describe("TuxPeoplePicker ARIA wiring", () => {
  it("is a combobox controlling a labelled listbox of options", async () => {
    const w = await mountPicker({ modelValue: ["lnguyen"], label: "Assignees" });
    const combo = input(w);
    expect(combo.attributes("role")).toBe("combobox");
    expect(combo.attributes("aria-expanded")).toBe("true");
    expect(combo.attributes("aria-autocomplete")).toBe("list");
    expect(combo.attributes("aria-label")).toBe("Find a person");
    const listbox = w.find('[role="listbox"]');
    expect(listbox.attributes("id")).toBe(combo.attributes("aria-controls"));
    expect(listbox.attributes("aria-label")).toBe("Assignees");
    expect(listbox.attributes("aria-multiselectable")).toBe("true");

    const opts = w.findAll('[role="option"]');
    expect(opts).toHaveLength(4);
    expect(opts[0]!.attributes("aria-selected")).toBe("true"); // selected first
    expect(opts[1]!.attributes("aria-selected")).toBe("false");
    const kaur = opts.find((o) => o.text().includes("Kaur"))!;
    expect(kaur.attributes("aria-disabled")).toBe("true");
    expect(kaur.text()).toContain("Needs access");
  });

  it("shows directory-order initials (\"Rojo, Alex\" → AR)", async () => {
    const w = await mountPicker();
    const rojo = w.findAll('[role="option"]').find((o) => o.text().includes("Rojo"))!;
    expect(rojo.find(".tux-avatar").text()).toBe("AR");
  });

  it("autofocuses the input by default", async () => {
    const w = await mountPicker({ autofocus: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(document.activeElement).toBe(input(w).element);
  });
});

describe("TuxPeoplePicker keyboard", () => {
  it("ArrowDown/ArrowUp move the active option and wrap", async () => {
    const w = await mountPicker();
    expect(input(w).attributes("aria-activedescendant")).toBeUndefined();

    await press(w, "ArrowDown");
    expect(activeName(w)).toBe("Rojo, Alex");
    await press(w, "ArrowUp"); // wraps to the last
    expect(activeName(w)).toBe("Peña, Sofía");
    await press(w, "ArrowDown"); // wraps to the first
    expect(activeName(w)).toBe("Rojo, Alex");
    await press(w, "ArrowDown");
    expect(activeName(w)).toBe("Nguyen, Linh");
  });

  it("ArrowUp from nothing active starts at the last option", async () => {
    const w = await mountPicker();
    await press(w, "ArrowUp");
    expect(activeName(w)).toBe("Peña, Sofía");
  });

  it("Home/End jump to the ends; with a modifier they stay caret keys", async () => {
    const w = await mountPicker();
    await press(w, "End");
    expect(activeName(w)).toBe("Peña, Sofía");
    await press(w, "Home");
    expect(activeName(w)).toBe("Rojo, Alex");
    await press(w, "End", { shiftKey: true });
    expect(activeName(w)).toBe("Rojo, Alex");
  });

  it("Enter toggles the active option and emits toggle + update:modelValue", async () => {
    const w = await mountPicker({ modelValue: ["lnguyen"] });
    // Order: Nguyen (selected) first, then Rojo.
    await press(w, "ArrowDown");
    await press(w, "ArrowDown");
    expect(activeName(w)).toBe("Rojo, Alex");
    await press(w, "Enter");
    expect(w.emitted("toggle")).toEqual([["arojo", true]]);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([["lnguyen", "arojo"]]);

    await w.setProps({ modelValue: ["lnguyen", "arojo"] });
    await press(w, "Enter"); // same active option: now deselect
    expect(w.emitted("toggle")?.at(-1)).toEqual(["arojo", false]);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([["lnguyen"]]);
  });

  it("Enter prevents default (never submits an enclosing form)", async () => {
    const w = await mountPicker();
    const ev = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    input(w).element.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("Escape emits close, prevents default and does not bubble", async () => {
    const w = await mountPicker();
    let reachedParent = false;
    const host = w.element.parentElement!;
    host.addEventListener("keydown", () => { reachedParent = true; });
    const ev = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    input(w).element.dispatchEvent(ev);
    expect(w.emitted("close")).toHaveLength(1);
    expect(ev.defaultPrevented).toBe(true);
    expect(reachedParent).toBe(false);
  });

  it("typing emits update:query immediately and activates the first match", async () => {
    const w = await mountPicker();
    await input(w).setValue("roj");
    expect(w.emitted("update:query")?.at(-1)).toEqual(["roj"]);
    expect(names(w)).toEqual(["Rojo, Alex"]);
    expect(activeName(w)).toBe("Rojo, Alex");
    await press(w, "Enter");
    expect(w.emitted("toggle")).toEqual([["arojo", true]]);
  });
});

describe("TuxPeoplePicker selection rules", () => {
  it("a disabled person is neither clickable nor Enter-able", async () => {
    const w = await mountPicker();
    const kaur = w.findAll('[role="option"]').find((o) => o.text().includes("Kaur"))!;
    await kaur.trigger("click");
    expect(w.emitted("toggle")).toBeUndefined();

    await press(w, "ArrowDown");
    await press(w, "ArrowDown");
    await press(w, "ArrowDown");
    expect(activeName(w)).toBe("Kaur, Tanvir"); // reachable, so the status is read
    await press(w, "Enter");
    expect(w.emitted("toggle")).toBeUndefined();
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("clicking an option toggles it", async () => {
    const w = await mountPicker();
    await w.findAll('[role="option"]')[1]!.trigger("click");
    expect(w.emitted("toggle")).toEqual([["lnguyen", true]]);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([["lnguyen"]]);
  });

  it("single select replaces the selection (old reported deselected first)", async () => {
    const w = await mountPicker({ multiple: false, modelValue: ["arojo"] });
    expect(w.find('[role="listbox"]').attributes("aria-multiselectable")).toBeUndefined();
    const nguyen = w.findAll('[role="option"]').find((o) => o.text().includes("Nguyen"))!;
    await nguyen.trigger("click");
    expect(w.emitted("toggle")).toEqual([
      ["arojo", false],
      ["lnguyen", true],
    ]);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([["lnguyen"]]);
  });

  it("remote mode never filters — the consumer's list is shown as given", async () => {
    const w = await mountPicker({ remote: true });
    await input(w).setValue("zzz-no-such-person");
    expect(w.emitted("update:query")?.at(-1)).toEqual(["zzz-no-such-person"]);
    expect(names(w)).toHaveLength(4);
  });

  it("remote: nothing stale is active until the new results land", async () => {
    const w = await mountPicker({ remote: true, loading: false });
    await input(w).setValue("nguy");
    await w.setProps({ loading: true });
    // The list still answers the previous query: Enter must not pick from it.
    expect(input(w).attributes("aria-activedescendant")).toBeUndefined();
    await press(w, "Enter");
    expect(w.emitted("toggle")).toBeUndefined();

    await w.setProps({ people: [people[1]!], loading: false });
    expect(activeName(w)).toBe("Nguyen, Linh");
  });

  it("local mode filters by name, subtitle and login, accent-insensitively", async () => {
    const w = await mountPicker();
    await input(w).setValue("pena");
    expect(names(w)).toEqual(["Peña, Sofía"]);
    await input(w).setValue("NIS");
    expect(names(w)).toEqual(["Nguyen, Linh"]);
    await input(w).setValue("@arojo");
    expect(names(w)).toEqual(["Rojo, Alex"]);
  });
});

describe("TuxPeoplePicker ordering", () => {
  it("selectedFirst puts selected people on top, keeping input order within groups", async () => {
    const w = await mountPicker({ modelValue: ["spena", "lnguyen"] });
    expect(names(w)).toEqual(["Nguyen, Linh", "Peña, Sofía", "Rojo, Alex", "Kaur, Tanvir"]);
  });

  it("selectedFirst=false keeps the given order", async () => {
    const w = await mountPicker({ modelValue: ["spena"], selectedFirst: false });
    expect(names(w)).toEqual(["Rojo, Alex", "Nguyen, Linh", "Kaur, Tanvir", "Peña, Sofía"]);
  });

  it("a pick does not re-sort under the pointer; the next query does", async () => {
    const w = await mountPicker({ modelValue: [] });
    const before = names(w);
    await w.findAll('[role="option"]')[3]!.trigger("click"); // Peña
    await w.setProps({ modelValue: ["spena"] }); // parent echoes v-model
    expect(names(w)).toEqual(before);

    await input(w).setValue("a"); // new query: re-sorted by the current selection
    expect(names(w)[0]).toBe("Peña, Sofía");
  });

  it("an outside v-model change re-sorts", async () => {
    const w = await mountPicker({ modelValue: [] });
    await w.setProps({ modelValue: ["tkaur"] });
    expect(names(w)[0]).toBe("Kaur, Tanvir");
  });
});

describe("TuxPeoplePicker loading and empty states", () => {
  it("loading keeps the current list and marks it busy", async () => {
    const w = await mountPicker({ loading: true });
    expect(names(w)).toHaveLength(4);
    expect(w.find('[role="listbox"]').attributes("aria-busy")).toBe("true");
    expect(w.find(".tux-people-picker__spinner").exists()).toBe(true);
    expect(w.text()).not.toContain("No one matches");
  });

  it("loading with nothing to show says so instead of the empty text", async () => {
    const w = await mountPicker({ people: [], loading: true });
    expect(w.text()).toContain("Searching…");
    expect(w.text()).not.toContain("No one matches");
  });

  it("empty shows emptyText, collapses the combobox, and takes an empty slot", async () => {
    const w = await mountPicker({ people: [], emptyText: "No one on this repo matches" });
    expect(w.find('[role="listbox"]').exists()).toBe(false);
    expect(input(w).attributes("aria-expanded")).toBe("false");
    expect(w.text()).toContain("No one on this repo matches");

    const slotted = await mountSuspended(TuxPeoplePicker, {
      props: { people: [], autofocus: false },
      slots: { empty: () => "The directory did not answer" },
    });
    expect(slotted.text()).toContain("The directory did not answer");
  });
});
