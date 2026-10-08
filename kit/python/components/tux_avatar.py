"""
TuxAvatar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAvatar:
    name: Optional[str] = None
    initials: Optional[str] = None
    photo_url: Optional[str] = None
    size: str = "md"
    dot: Optional[str] = None
    decorative: bool = True
    alt: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-avatar">{content}</span>'
