"""
TuxBigStat — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBigStat:
    value: str = None
    suffix: str = null
    label: str = None
    source: str = null
    variant: str = default
    tone: str = maroon
    size: str = md

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-big-stat">{content}</div>'
