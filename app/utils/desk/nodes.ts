import { Node } from "@tiptap/core";
import { NodeSelection, type Selection } from "@tiptap/pm/state";
import { assertNever } from "./types";
import {
  calloutTone,
  calloutToneLabel,
  isModuleKind,
  moduleCards,
  moduleStats,
  moduleSteps,
  sanitizePayload,
  type ModuleKind,
} from "./modules";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    deskVideo: {
      setDeskVideo: (options: { src: string; title?: string }) => ReturnType;
    };
    deskVimeo: {
      setDeskVimeo: (options: { src: string }) => ReturnType;
    };
    deskModule: {
      setDeskModule: (options: { kind: ModuleKind; payload?: Record<string, string> }) => ReturnType;
    };
  }
}

function attr(value: unknown): string {
  return value == null ? "" : String(value);
}

export function posAfterSelectedAtom(selection: Selection): number | null {
  if (selection instanceof NodeSelection && selection.node.isAtom) {
    return selection.to;
  }
  return null;
}

export const DeskVideo = Node.create({
  name: "deskVideo",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "video[data-desk-video]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      { class: "desk-media desk-media--video" },
      [
        "video",
        {
          "data-desk-video": "",
          src: attr(HTMLAttributes.src),
          controls: "true",
          playsinline: "true",
          title: attr(HTMLAttributes.title),
        },
      ],
    ];
  },
  addCommands() {
    return {
      setDeskVideo:
        (options: { src: string; title?: string }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),
    };
  },
});

export const DeskVimeo = Node.create({
  name: "deskVimeo",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: "iframe[data-desk-vimeo]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      { class: "desk-media desk-media--embed" },
      [
        "iframe",
        {
          "data-desk-vimeo": "",
          src: attr(HTMLAttributes.src),
          title: "Vimeo video",
          allow: "autoplay; fullscreen; picture-in-picture",
          allowfullscreen: "true",
          loading: "lazy",
        },
      ],
    ];
  },
  addCommands() {
    return {
      setDeskVimeo:
        (options: { src: string }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),
    };
  },
});

function textNode(tag: string, className: string, value: string) {
  if (!value) return null;
  return [tag, { class: className }, value];
}

function kids(...nodes: unknown[]) {
  return nodes.filter((node) => node != null && node !== "");
}

function moduleChildren(kind: ModuleKind, payload: Record<string, string>): unknown[] {
  switch (kind) {
    case "hero":
      return kids(
        textNode("p", "desk-module__eyebrow", payload.eyebrow || ""),
        textNode("h2", "desk-module__title", payload.title || ""),
        textNode("p", "desk-module__lead", payload.lead || ""),
        payload.actionLabel && payload.actionHref
          ? ["a", { class: "desk-module__action", href: payload.actionHref }, payload.actionLabel]
          : null,
      );
    case "callout": {
      const tone = calloutTone(payload);
      return kids(
        ["p", { class: "desk-module__kicker" }, calloutToneLabel(tone)],
        textNode("strong", "desk-module__title", payload.title || ""),
        textNode("p", "desk-module__body", payload.body || ""),
      );
    }
    case "split":
      return [
        [
          "div",
          { class: "desk-module__col" },
          ...kids(
            textNode("p", "desk-module__kicker", payload.kicker || ""),
            textNode("h2", "desk-module__title", payload.title || ""),
            textNode("p", "desk-module__body", payload.body || ""),
          ),
        ],
        [
          "aside",
          { class: "desk-module__aside" },
          ...kids(
            textNode("strong", "desk-module__title", payload.asideTitle || ""),
            textNode("p", "desk-module__body", payload.asideBody || ""),
          ),
        ],
      ];
    case "cards":
      return kids(
        textNode("h2", "desk-module__title", payload.heading || ""),
        [
          "div",
          { class: "desk-module__grid" },
          ...moduleCards(payload).map((card) =>
            card.href
              ? [
                  "a",
                  { class: "desk-module__card", href: card.href },
                  ["strong", {}, card.title],
                  ...kids(card.body ? ["p", {}, card.body] : null),
                ]
              : [
                  "article",
                  { class: "desk-module__card" },
                  ["strong", {}, card.title],
                  ...kids(card.body ? ["p", {}, card.body] : null),
                ],
          ),
        ],
      );
    case "steps":
      return kids(
        textNode("h2", "desk-module__title", payload.heading || ""),
        [
          "ol",
          { class: "desk-module__steps" },
          ...moduleSteps(payload).map((step) => [
            "li",
            {},
            ["strong", {}, step.title],
            ...kids(step.body ? ["p", {}, step.body] : null),
          ]),
        ],
      );
    case "cta":
      return kids(
        textNode("h2", "desk-module__title", payload.title || ""),
        textNode("p", "desk-module__body", payload.body || ""),
        payload.actionLabel && payload.actionHref
          ? ["a", { class: "desk-module__action", href: payload.actionHref }, payload.actionLabel]
          : null,
      );
    case "stats":
      return [
        [
          "dl",
          { class: "desk-module__stats" },
          ...moduleStats(payload).flatMap((stat) => [
            ["dt", {}, stat.label],
            ["dd", {}, stat.value],
          ]),
        ],
      ];
    default:
      return assertNever(kind, "module kind");
  }
}

export const DeskModule = Node.create({
  name: "deskModule",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      kind: { default: "callout" },
      payload: { default: {} },
    };
  },
  parseHTML() {
    return [
      {
        tag: "section[data-desk-module]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const kind = element.getAttribute("data-desk-module") || "";
          if (!isModuleKind(kind)) return false;
          let payload: unknown = {};
          try {
            payload = JSON.parse(element.getAttribute("data-payload") || "{}");
          } catch {
            payload = {};
          }
          return { kind, payload: sanitizePayload(kind, payload) };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const kind = isModuleKind(String(HTMLAttributes.kind))
      ? (HTMLAttributes.kind as ModuleKind)
      : "callout";
    const payload = sanitizePayload(kind, HTMLAttributes.payload);
    const toneClass = kind === "callout" ? ` desk-module--${calloutTone(payload)}` : "";
    return [
      "section",
      {
        class: `desk-module desk-module--${kind}${toneClass}`,
        "data-desk-module": kind,
        "data-payload": JSON.stringify(payload),
      },
      ...moduleChildren(kind, payload),
    ];
  },
  addCommands() {
    return {
      setDeskModule:
        (options: { kind: ModuleKind; payload?: Record<string, string> }) =>
        ({ chain, state }) => {
          const content = {
            type: this.name,
            attrs: {
              kind: options.kind,
              payload: sanitizePayload(options.kind, options.payload),
            },
          };
          const after = posAfterSelectedAtom(state.selection);
          if (after != null) {
            return chain().insertContentAt(after, content).run();
          }
          return chain().insertContent(content).run();
        },
    };
  },
});
