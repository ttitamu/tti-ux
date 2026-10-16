"""
TuxAvatar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAvatar:
    name: str = None
    initials: str = None
    photo_url: str = None
    size: str = "md"
    dot: str = None
    decorative: bool = true
    alt: str = None

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-avatar">{content}</span>'
