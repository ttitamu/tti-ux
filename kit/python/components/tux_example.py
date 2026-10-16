"""
TuxExample — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxExample:
    vue: str = None
    react: str = None
    wc: str = None
    razor: str = None
    python: str = None
    php: str = None
    swift: str = None
    kotlin: str = None
    source: str = None
    css: str = None
    powerbi: str = None
    title: str = None
    preview_padding: str = "p-6"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-example">{content}</div>'
