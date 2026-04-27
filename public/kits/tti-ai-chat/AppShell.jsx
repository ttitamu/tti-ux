/* global React, ConversationListItem, ChatIcon, MessageBubble, Composer, TuxButton, TuxSectionHeader, TuxBadge, LucideIcon, IconActionButton, ModelChip */

const { useState: _useState } = React;

// ─── Sidebar with conversation list ────────────────────────────────────────
function ChatSidebar({ conversations, activeId, onSelect, onNew, collapsed, onToggle }) {
  if (collapsed) {
    return (
      <aside style={{ width: 48, background: "var(--surface-raised)", borderRight: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 10 }}>
        <button onClick={onToggle} title="Expand sidebar" style={{ background: "transparent", border: "none", padding: 8, cursor: "pointer", color: "var(--text-secondary)", borderRadius: 4 }}>
          <ChatIcon name="panel-left-open" size={16} />
        </button>
        <button onClick={onNew} title="New chat" style={{ background: "var(--brand-primary)", border: "none", padding: 8, cursor: "pointer", color: "#fff", borderRadius: 4 }}>
          <ChatIcon name="plus" size={16} />
        </button>
      </aside>
    );
  }

  const pinned = conversations.filter((c) => c.pinned);
  const today = conversations.filter((c) => !c.pinned && c.group === "today");
  const earlier = conversations.filter((c) => !c.pinned && c.group === "earlier");

  return (
    <aside style={{ width: 280, background: "var(--surface-raised)", borderRight: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Brand */}
      <header style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 10 }}>
        <img src="../../assets/logo.svg" alt="" width="28" height="28" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em" }}>tti-ux</div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
            ai-chat · research
          </div>
        </div>
        <button onClick={onToggle} title="Collapse sidebar" style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer", color: "var(--text-muted)", borderRadius: 4 }}>
          <ChatIcon name="panel-left-close" size={16} />
        </button>
      </header>

      {/* New chat */}
      <div style={{ padding: 12 }}>
        <button onClick={onNew} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-primary)" }}>
          <ChatIcon name="plus" size={14} />
          New chat
          <span style={{ marginLeft: "auto", fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>⌘N</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "0 12px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "var(--surface-sunken)", borderRadius: "var(--radius-md)" }}>
          <ChatIcon name="search" size={13} />
          <input placeholder="Search chats" style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.8rem", fontFamily: "inherit", color: "var(--text-primary)" }} />
        </div>
      </div>

      {/* Conversation list */}
      <nav style={{ flex: 1, overflow: "auto", paddingBottom: 12 }}>
        {pinned.length ? (
          <>
            <SidebarGroupLabel>pinned</SidebarGroupLabel>
            {pinned.map((c) => (
              <ConversationListItem key={c.id} {...c} active={c.id === activeId} onClick={() => onSelect(c.id)} />
            ))}
          </>
        ) : null}
        {today.length ? (
          <>
            <SidebarGroupLabel>today</SidebarGroupLabel>
            {today.map((c) => (
              <ConversationListItem key={c.id} {...c} active={c.id === activeId} onClick={() => onSelect(c.id)} />
            ))}
          </>
        ) : null}
        {earlier.length ? (
          <>
            <SidebarGroupLabel>earlier this week</SidebarGroupLabel>
            {earlier.map((c) => (
              <ConversationListItem key={c.id} {...c} active={c.id === activeId} onClick={() => onSelect(c.id)} />
            ))}
          </>
        ) : null}
      </nav>

      {/* Footer */}
      <footer style={{ padding: "10px 14px", borderTop: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "var(--brand-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>AG</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Anthony Guevara</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Research IT · TTI</div>
        </div>
        <button title="Settings" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", padding: 6 }}>
          <ChatIcon name="settings" size={15} />
        </button>
      </footer>
    </aside>
  );
}

function SidebarGroupLabel({ children }) {
  return (
    <div className="eyebrow" style={{ padding: "14px 16px 6px" }}>
      {children}
    </div>
  );
}

// ─── TopBar for the chat surface ───────────────────────────────────────────
function ChatTopBar({ title, model, onModelChange, grounding }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-raised)", minHeight: 56, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <h1 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: 0, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </h1>
        {grounding ? (
          <TuxBadge kind="tag">
            <ChatIcon name="book-open" size={11} />
            <span style={{ marginLeft: 4, whiteSpace: "nowrap" }}>{grounding}</span>
          </TuxBadge>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ModelChip name={model} provider="openai" onClick={onModelChange} />
        <span style={{ width: 1, height: 20, background: "var(--surface-border)" }} />
        <IconActionButton icon="download" label="Export conversation" />
        <IconActionButton icon="trash" label="Delete conversation" />
      </div>
    </header>
  );
}

Object.assign(window, {
  ChatSidebar,
  ChatTopBar,
  SidebarGroupLabel,
});
