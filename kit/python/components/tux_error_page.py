"""
TuxErrorPage — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxErrorPage:
    code: str = "404"
    title: str = None
    lede: str = None
    actions: str = None
    inline: bool = false
    icon: str = None
    details: str = None

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-error-page">{content}</section>'
