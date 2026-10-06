import React from "react";
import "./tux-kbd.css";

export interface TuxKbdProps {
  /** Single key. Use keys for multi-key combos. */
  value?: string;
  /** Multi-key combo. Each entry renders as a separate <kbd>. */
  keys?: string[];
  /** Visual size. sm is default. */
  size?: "xs" | "sm" | "lg";
  /** Separator string between keys (e.g. "+"). */
  separator?: string;
  className?: string;
  children?: React.ReactNode;
}

const MAC_SYMBOLS: Record<string, string> = {
  meta: "⌘",
  cmd: "⌘",
  command: "⌘",
  ctrl: "⌃",
  control: "⌃",
  shift: "⇧",
  alt: "⌥",
  option: "⌥",
  super: "⌘",
  win: "⌘",
  enter: "↵",
  return: "↵",
  escape: "esc",
  esc: "esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  backspace: "⌫",
  delete: "⌦",
  tab: "⇥",
  space: "␣",
};

const PC_SYMBOLS: Record<string, string> = {
  meta: "Ctrl",
  cmd: "Ctrl",
  command: "Ctrl",
  ctrl: "Ctrl",
  control: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  option: "Alt",
  super: "Win",
  win: "Win",
  enter: "↵",
  return: "↵",
  escape: "Esc",
  esc: "Esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  backspace: "⌫",
  delete: "Del",
  tab: "Tab",
  space: "␣",
};

function formatKey(key: string, isMac: boolean): string {
  const k = key.toLowerCase();
  const table = isMac ? MAC_SYMBOLS : PC_SYMBOLS;
  if (table[k]) return table[k];
  if (/^[a-z]$/.test(k)) return k.toUpperCase();
  return key;
}

export const TuxKbd: React.FC<TuxKbdProps> = ({
  value,
  keys,
  size = "sm",
  separator = "",
  className = "",
  children,
}) => {
  const isMac =
    typeof navigator !== "undefined" &&
    (/Mac|iP(hone|od|ad)/i.test(navigator.platform || "") ||
      /Macintosh/i.test(navigator.userAgent || ""));

  let displayKeys: string[] = [];
  if (keys && keys.length > 0) {
    displayKeys = keys.map((k) => formatKey(k, isMac));
  } else if (value) {
    displayKeys = [formatKey(value, isMac)];
  }

  return (
    <span
      className={`tux-kbd-group tux-kbd-group--${size} ${className}`.trim()}
    >
      {displayKeys.length > 0 ? (
        displayKeys.map((k, i) => (
          <React.Fragment key={i}>
            <kbd className="tux-kbd">{k}</kbd>
            {separator && i < displayKeys.length - 1 && (
              <span className="tux-kbd-sep" aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        ))
      ) : children ? (
        <kbd className="tux-kbd">{children}</kbd>
      ) : null}
    </span>
  );
};
