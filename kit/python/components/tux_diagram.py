"""
TuxDiagram — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDiagram:
    code: str = None
    caption: str = "undefined"
    eyebrow: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-diagram">{content}</figure>'
