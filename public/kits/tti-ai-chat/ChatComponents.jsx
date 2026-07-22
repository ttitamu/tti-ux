/* global React */
/*
 * ChatComponents.jsx — tti-ai-chat specific components built on TuxComponents.
 * Keeps the chat UI vocabulary separate from generic Tux primitives.
 */

const { useState: _useState, useEffect: _useEffect, useRef: _useRef } = React;

// Extra Lucide-style icons for chat chrome (not in TuxComponents' base set)
const CHAT_ICONS = {
  "send": "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  "message-square": "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z",
  "sparkles": "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14zM5 17l.6 1.6L7 19l-1.4.4L5 21l-.6-1.6L3 19l1.4-.4L5 17z",
  "paperclip": "M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8",
  "copy": "M8 4h10a2 2 0 0 1 2 2v10M4 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z",
  "thumbs-up": "M7 10v11H3V10h4zM7 10l5-8c1.5 0 2.5 1 2.5 2.5V10h5.5a2 2 0 0 1 2 2.3l-1.5 7a2 2 0 0 1-2 1.7H7",
  "thumbs-down": "M17 14V3h4v11h-4zM17 14l-5 8c-1.5 0-2.5-1-2.5-2.5V14H4a2 2 0 0 1-2-2.3l1.5-7A2 2 0 0 1 5.5 3H17",
  "refresh": "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
  "book-open": "M2 3h7a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3zM22 3h-7a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h8V3z",
  "globe": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 3 4 7 4 9s-1.5 6-4 9c-2.5-3-4-7-4-9s1.5-6 4-9z",
  "code": "M16 18l6-6-6-6M8 6l-6 6 6 6",
  "edit-3": "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
  "trash": "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6",
  "panel-left-close": "M3 3h18v18H3V3zM9 3v18M14 9l-3 3 3 3",
  "panel-left-open": "M3 3h18v18H3V3zM9 3v18M11 9l3 3-3 3",
  "stop-circle": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9h6v6H9z",
  "at-sign": "M12 3a9 9 0 1 0 3 17.5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 8v5a3 3 0 0 0 5 0v-1a9 9 0 0 0-9-9",
  "cpu": "M5 5h14v14H5zM9 9h6v6H9zM3 9h2M3 15h2M19 9h2M19 15h2M9 3v2M15 3v2M9 19v2M15 19v2",
  "zap": "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
};

function ChatIcon({ name, size = 16, spin = false }) {
  const d = CHAT_ICONS[name];
  if (!d) {
    // fall through to TuxComponents LucideIcon for shared names
    return <LucideIcon name={name} size={size} spin={spin} />;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={spin ? { animation: "tux-spin 0.9s linear infinite" } : {}}
    >
      <path d={d} />
    </svg>
  );
}

// ─── ConversationListItem ──────────────────────────────────────────────────
function ConversationListItem({ title, subtitle, timestamp, active, pinned, onClick }) {
  const [hover, setHover] = _useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        border: "none",
        padding: "10px 14px",
        borderLeft: active ? "3px solid var(--brand-primary)" : "3px solid transparent",
        background: active
          ? "color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised))"
          : hover
          ? "color-mix(in srgb, var(--brand-primary) 4%, transparent)"
          : "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--text-primary)",
        transition: "background 150ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: "0.875rem", fontWeight: active ? 600 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pinned ? <span style={{ color: "var(--brand-accent)", marginRight: 4 }}>▪</span> : null}
          {title}
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>{timestamp}</div>
      </div>
      {subtitle ? (
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {subtitle}
        </div>
      ) : null}
    </button>
  );
}

// ─── MessageBubble ─────────────────────────────────────────────────────────
function MessageBubble({ role, children, model, timestamp, sources, onCopy, onRegen }) {
  const isUser = role === "user";
  const [hover, setHover] = _useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        gap: 14,
        padding: "20px 0",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 4, background: isUser ? "var(--surface-sunken)" : "var(--brand-primary)", color: isUser ? "var(--text-primary)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em" }}>
        {isUser ? "AG" : <ChatIcon name="sparkles" size={16} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {isUser ? "Anthony Guevara" : "tti-ai-chat"}
          </span>
          {model && !isUser ? (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{model}</span>
          ) : null}
          {timestamp ? (
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{timestamp}</span>
          ) : null}
        </div>
        <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-primary)" }}>
          {children}
        </div>
        {sources && sources.length ? (
          <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-sunken)", borderLeft: "3px solid var(--brand-accent)", borderRadius: 2 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>grounded in</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {sources.map((s, i) => (
                <li key={i} style={{ fontSize: "0.8rem" }}>
                  <span className="link-tti" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{s.path}</span>
                  <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>· {s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {!isUser ? (
          <div style={{ display: "flex", gap: 4, marginTop: 10, opacity: hover ? 1 : 0.35, transition: "opacity 150ms" }}>
            <IconActionButton icon="copy" label="Copy" onClick={onCopy} />
            <IconActionButton icon="refresh" label="Regenerate" onClick={onRegen} />
            <IconActionButton icon="thumbs-up" label="Good response" />
            <IconActionButton icon="thumbs-down" label="Flag issue" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function IconActionButton({ icon, label, onClick }) {
  const [hover, setHover] = _useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      style={{
        border: "none",
        background: hover ? "var(--surface-sunken)" : "transparent",
        padding: "5px 7px",
        borderRadius: 4,
        cursor: "pointer",
        color: hover ? "var(--text-primary)" : "var(--text-muted)",
        display: "inline-flex",
        alignItems: "center",
        transition: "background 120ms, color 120ms",
      }}
    >
      <ChatIcon name={icon} size={14} />
    </button>
  );
}

// ─── ModelChip ─────────────────────────────────────────────────────────────
function ModelChip({ name, provider, onClick, selected }) {
  const [hover, setHover] = _useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 10px",
        border: selected ? "1px solid var(--brand-primary)" : "1px solid var(--surface-border)",
        borderRadius: "var(--radius-md)",
        background: selected ? "color-mix(in srgb, var(--brand-primary) 6%, var(--surface-raised))" : hover ? "var(--surface-sunken)" : "var(--surface-raised)",
        color: "var(--text-primary)",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontFamily: "inherit",
        transition: "all 150ms",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <ChatIcon name="cpu" size={12} />
      <span style={{ fontWeight: 600 }}>{name}</span>
      {provider ? <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{provider}</span> : null}
    </button>
  );
}

// ─── Composer ──────────────────────────────────────────────────────────────
function Composer({ onSend, model, onChangeModel, attachedDocs = [] }) {
  const [text, setText] = _useState("");
  const textareaRef = _useRef(null);
  const [height, setHeight] = _useState(60);

  const handleChange = (e) => {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      const h = Math.min(ta.scrollHeight, 220);
      ta.style.height = h + "px";
      setHeight(h);
    }
  };

  const send = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
      setHeight(60);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-lg)", background: "var(--surface-raised)", padding: 12, boxShadow: "var(--shadow-sm)" }}>
      {attachedDocs.length ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {attachedDocs.map((d, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px", background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
              <ChatIcon name="paperclip" size={12} />
              {d}
              <ChatIcon name="x" size={12} />
            </span>
          ))}
        </div>
      ) : null}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Ask about research data, policies, or a file path…"
        style={{
          width: "100%",
          minHeight: 60,
          border: "none",
          outline: "none",
          resize: "none",
          fontFamily: "inherit",
          fontSize: "0.9375rem",
          lineHeight: 1.55,
          background: "transparent",
          color: "var(--text-primary)",
          padding: 0,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconActionButton icon="paperclip" label="Attach document" />
          <IconActionButton icon="at-sign" label="Mention grounding source" />
          <span style={{ width: 1, height: 16, background: "var(--surface-border)", margin: "0 4px" }} />
          <ModelChip name={model} provider="openai" selected />
        </div>
        <button
          onClick={send}
          disabled={!text.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: text.trim() ? "var(--brand-primary)" : "var(--surface-sunken)",
            color: text.trim() ? "#fff" : "var(--text-muted)",
            cursor: text.trim() ? "pointer" : "not-allowed",
            fontSize: "0.8rem",
            fontWeight: 500,
            fontFamily: "inherit",
          }}
        >
          Send
          <ChatIcon name="send" size={13} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  ChatIcon,
  ConversationListItem,
  MessageBubble,
  IconActionButton,
  ModelChip,
  Composer,
});
