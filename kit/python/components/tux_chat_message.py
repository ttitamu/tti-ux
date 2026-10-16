"""
TuxChatMessage — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChatMessage:
    role: str = "user"
    author: Optional[str] = None
    timestamp: Optional[str] = None
    meta: Optional[str] = None
    initials: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-chat-message">{content}</article>'
