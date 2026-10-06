"""
TuxChatMessage — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxChatMessage:
    role: str = "user"
    author: str = None
    timestamp: str = "undefined"
    meta: str = "undefined"
    initials: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-chat-message">{content}</article>'
