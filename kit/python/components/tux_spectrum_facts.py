"""
TuxSpectrumFacts — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSpectrumFacts:
    title: str = "QUICK"
    subtitle: str = None
    items: str = "()"
    tone: str = dark
    show_top_ribbon: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-spectrum-facts">{content}</section>'
