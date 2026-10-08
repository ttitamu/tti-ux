"""
TuxDiagram — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxDiagram:
    code: Optional[str] = None
    caption: Optional[str] = None
    eyebrow: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-diagram">{content}</figure>'
