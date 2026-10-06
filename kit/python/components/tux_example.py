"""
TuxExample — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxExample:
    vue: str = "undefined"
    react: str = "undefined"
    wc: str = "undefined"
    razor: str = "undefined"
    source: str = "undefined"
    css: str = "undefined"
    powerbi: str = "undefined"
    title: str = "undefined"
    preview_padding: str = "p-6"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-example">{content}</div>'
