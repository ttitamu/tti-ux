"""
TuxErrorPage — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxErrorPage:
    code: str = "404"
    title: str = "undefined"
    lede: str = "undefined"
    actions: str = "undefined"
    inline: bool = false
    icon: str = "undefined"
    details: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-error-page">{content}</section>'
