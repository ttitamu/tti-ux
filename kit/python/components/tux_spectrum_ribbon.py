"""
TuxSpectrumRibbon — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSpectrumRibbon:
    size: str = sm
    orientation: str = horizontal
    show_labels: bool = false
    rounded: bool = false
    aria_label: str = "TTI"
    bands: str = "()"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-spectrum-ribbon">{content}</div>'
