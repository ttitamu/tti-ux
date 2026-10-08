"""
TuxChatBubble — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChatBubble:
    mode: str = "bubble"
    role: str = "assistant"
    title: str = "Assistant"
    subtitle: str = "Institutional"
    state: str = "idle"
    teaser: Optional[str] = None
    tail: str = "none"
    dismissible: bool = False
    open: bool = True
    suggestions: str = "()"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-chat-bubble">{content}</div>'
