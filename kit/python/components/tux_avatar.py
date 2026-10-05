"""
TuxAvatar — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAvatar:
    name: str = "undefined"
    initials: str = "undefined"
    photo_url: str = "undefined"
    size: str = md
    dot: str = undefined
    decorative: bool = true
    alt: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-avatar">{content}</span>'
