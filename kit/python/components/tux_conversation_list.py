"""
TuxConversationList — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxConversationList:
    groups: str = None
    active_id: str = None

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-conversation-list">{content}</nav>'
