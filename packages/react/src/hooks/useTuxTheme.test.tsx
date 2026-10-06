import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTuxTheme } from "./useTuxTheme";

describe("useTuxTheme (React hook)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
    delete document.documentElement.dataset.theme;
  });

  it("initializes with default 'tti' theme and sets data-theme on html element", () => {
    const { result } = renderHook(() => useTuxTheme());
    expect(result.current.theme).toBe("tti");
    expect(document.documentElement.dataset.theme).toBe("tti");
  });

  it("updates data-theme attribute when setTheme is called", () => {
    const { result } = renderHook(() => useTuxTheme());

    act(() => {
      result.current.setTheme("tti-dark");
    });

    expect(result.current.theme).toBe("tti-dark");
    expect(document.documentElement.dataset.theme).toBe("tti-dark");
  });

  it("cycles themes correctly when toggleTheme is called", () => {
    const { result } = renderHook(() => useTuxTheme("tti"));

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("tti-dark");

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("tti-hc");

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("tti");
  });
});
