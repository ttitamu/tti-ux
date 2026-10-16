"""
TuxErrorPage — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxErrorPage:
    code: str = "404"
    title: Optional[str] = None
    lede: Optional[str] = None
    actions: Optional[str] = None
    inline: bool = False
    icon: Optional[str] = None
    details: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-error-page">{content}</section>'
