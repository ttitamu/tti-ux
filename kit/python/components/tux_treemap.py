"""
TuxTreemap — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTreemap:
    data: str = None
    width: int = 720
    height: int = 460
    max_depth: int = 2
    color_by: str = size
    unit: str = bytes
    aria_label: str = "Treemap"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-treemap">{content}</div>'
