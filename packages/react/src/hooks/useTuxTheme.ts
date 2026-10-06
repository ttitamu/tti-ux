import { useEffect, useState, useCallback } from "react";

export type TuxTheme = "tti" | "tti-dark" | "tti-hc";

const STORAGE_KEY = "tux-theme";

function getStoredTheme(): TuxTheme | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(STORAGE_KEY) as TuxTheme | null;
    }
  } catch {
    // Ignore sandbox or security errors
  }
  return null;
}

function setStoredTheme(theme: TuxTheme) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    // Ignore sandbox or security errors
  }
}

/**
 * useTuxTheme — React hook to manage TUX design system themes.
 *
 * Automatically syncs with `document.documentElement.dataset.theme`,
 * listens to external changes via MutationObserver, and persists to localStorage.
 *
 * Usage:
 *   const { theme, setTheme, toggleTheme } = useTuxTheme();
 */
export function useTuxTheme(defaultTheme: TuxTheme = "tti") {
  const [theme, setInternalTheme] = useState<TuxTheme>(() => {
    if (typeof document === "undefined") return defaultTheme;
    const current = document.documentElement.dataset.theme as TuxTheme | undefined;
    if (current && (current === "tti" || current === "tti-dark" || current === "tti-hc")) {
      return current;
    }
    const stored = getStoredTheme();
    return stored || defaultTheme;
  });

  const setTheme = useCallback((nextTheme: TuxTheme) => {
    setInternalTheme(nextTheme);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = nextTheme;
      setStoredTheme(nextTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "tti" ? "tti-dark" : theme === "tti-dark" ? "tti-hc" : "tti");
  }, [theme, setTheme]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Apply on mount
    document.documentElement.dataset.theme = theme;

    // Listen for attribute changes from outside React (e.g. host app or switcher)
    const observer = new MutationObserver(() => {
      const current = document.documentElement.dataset.theme as TuxTheme | undefined;
      if (current && (current === "tti" || current === "tti-dark" || current === "tti-hc")) {
        setInternalTheme(current);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
