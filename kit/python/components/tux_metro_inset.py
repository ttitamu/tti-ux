"""
TuxMetroInset — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMetroInset:
    name: Optional[str] = None
    highway_label: Optional[str] = None
    height: int = 220
    palette: str = "maroon"
    seed: Optional[str] = None
    cols: int = 8
    rows: int = 6

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-metro-inset">{content}</div>'
