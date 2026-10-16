"""
TuxExample — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxExample:
    vue: Optional[str] = None
    react: Optional[str] = None
    wc: Optional[str] = None
    razor: Optional[str] = None
    python: Optional[str] = None
    php: Optional[str] = None
    swift: Optional[str] = None
    kotlin: Optional[str] = None
    source: Optional[str] = None
    css: Optional[str] = None
    powerbi: Optional[str] = None
    title: Optional[str] = None
    preview_padding: str = "p-6"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-example">{content}</div>'
