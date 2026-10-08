"""
TuxBetaRibbon — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxBetaRibbon:
    variant: str = "corner"
    kind: str = "preview"
    label: Optional[str] = None
    corner: str = "top-right"
    message: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-beta-ribbon">{content}</div>'
