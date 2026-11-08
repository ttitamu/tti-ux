"""
TuxFeedStatus — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFeedStatus:
    feeds: Optional[str] = None
    title: Optional[str] = None
    layout: str = "list"
    syncable: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-feed-status">{content}</div>'
