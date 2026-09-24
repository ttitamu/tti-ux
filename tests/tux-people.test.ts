/**
 * Behavior locks for tuxPeople — the pure logic under TuxPeoplePicker:
 * directory-order initials, the local filter, display order and what a
 * pick does to the selection. The mounted contract lives in
 * tests/components/tux-people-picker.nuxt.test.ts.
 */
import { describe, expect, it } from "vitest";
import {
  tuxFilterPeople,
  tuxFoldText,
  tuxOrderPeople,
  tuxPersonInitials,
  tuxTogglePerson,
  type TuxPerson,
} from "../app/utils/tuxPeople";

const p = (id: string, name: string, subtitle?: string): TuxPerson => ({ id, name, subtitle });

describe("tuxPersonInitials", () => {
  it("reads Entra directory order: given name, then family", () => {
    expect(tuxPersonInitials("Rojo, Alex")).toBe("AR");
    expect(tuxPersonInitials("Rojo, Alex M.")).toBe("AR");
    expect(tuxPersonInitials("Villarreal Garza, Marisol")).toBe("MV");
  });

  it("uses first + last word for natural order and drops suffixes", () => {
    expect(tuxPersonInitials("Alex Rojo")).toBe("AR");
    expect(tuxPersonInitials("Alex M. Rojo")).toBe("AR");
    expect(tuxPersonInitials("Alex Rojo Jr.")).toBe("AR");
    expect(tuxPersonInitials("Rojo, Alex, Jr.")).toBe("AR");
  });

  it("ignores parentheticals and punctuation, keeps accents", () => {
    expect(tuxPersonInitials("Rojo, Alex (Student)")).toBe("AR");
    expect(tuxPersonInitials("Ávila, Íñigo")).toBe("ÍÁ");
    expect(tuxPersonInitials("@arojo")).toBe("A");
  });

  it("handles one word and nothing", () => {
    expect(tuxPersonInitials("Alex")).toBe("A");
    expect(tuxPersonInitials("")).toBe("");
    expect(tuxPersonInitials("   ")).toBe("");
  });
});

describe("tuxFilterPeople", () => {
  const list = [
    p("arojo", "Rojo, Alex", "Student Technician · NET"),
    p("spena", "Peña, Sofía", "Program Manager · Transit Mobility"),
    p("lnguyen", "Nguyen, Linh", "Systems Administrator II · NIS"),
  ];

  it("keeps everyone (in order) for an empty query", () => {
    expect(tuxFilterPeople(list, "  ").map((x) => x.id)).toEqual(["arojo", "spena", "lnguyen"]);
  });

  it("matches every token anywhere, in any order", () => {
    expect(tuxFilterPeople(list, "alex rojo").map((x) => x.id)).toEqual(["arojo"]);
    expect(tuxFilterPeople(list, "rojo, alex").map((x) => x.id)).toEqual(["arojo"]);
    expect(tuxFilterPeople(list, "alex nis")).toEqual([]);
  });

  it("is case- and accent-insensitive both ways", () => {
    expect(tuxFilterPeople(list, "pena").map((x) => x.id)).toEqual(["spena"]);
    expect(tuxFilterPeople(list, "SOFÍA").map((x) => x.id)).toEqual(["spena"]);
    expect(tuxFoldText("Peña")).toBe("pena");
  });

  it("matches subtitle and login, with or without @", () => {
    expect(tuxFilterPeople(list, "transit").map((x) => x.id)).toEqual(["spena"]);
    expect(tuxFilterPeople(list, "@lnguyen").map((x) => x.id)).toEqual(["lnguyen"]);
  });
});

describe("tuxOrderPeople", () => {
  const list = [p("a", "A"), p("b", "B"), p("c", "C"), p("d", "D")];

  it("moves selected people up, stable within each group", () => {
    expect(tuxOrderPeople(list, ["d", "b"]).map((x) => x.id)).toEqual(["b", "d", "a", "c"]);
  });

  it("keeps the given order when selectedFirst is false", () => {
    expect(tuxOrderPeople(list, ["d"], false).map((x) => x.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("drops repeated ids, first occurrence wins", () => {
    const merged = [p("a", "A"), p("b", "B"), { ...p("a", "A (again)") }];
    expect(tuxOrderPeople(merged, []).map((x) => x.name)).toEqual(["A", "B"]);
  });
});

describe("tuxTogglePerson", () => {
  it("multiple: adds and removes", () => {
    expect(tuxTogglePerson(["a"], "b", true)).toEqual({ next: ["a", "b"], changes: [["b", true]] });
    expect(tuxTogglePerson(["a", "b"], "a", true)).toEqual({ next: ["b"], changes: [["a", false]] });
  });

  it("single: replaces, reporting the old person deselected first", () => {
    expect(tuxTogglePerson(["a"], "b", false)).toEqual({
      next: ["b"],
      changes: [["a", false], ["b", true]],
    });
    expect(tuxTogglePerson([], "b", false)).toEqual({ next: ["b"], changes: [["b", true]] });
  });

  it("single: picking the selected person clears it", () => {
    expect(tuxTogglePerson(["a"], "a", false)).toEqual({ next: [], changes: [["a", false]] });
  });
});
