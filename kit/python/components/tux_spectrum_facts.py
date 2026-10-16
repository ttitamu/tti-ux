"""
TuxSpectrumFacts — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSpectrumFacts:
    title: Optional[str] = None
    subtitle: Optional[str] = None
    items: Optional[str] = None
    tone: str = "dark"
    show_top_ribbon: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-spectrum-facts">{content}</section>'
