"""
TuxTabs — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTabs:
    items: Optional[str] = None
    model_value: Optional[str] = None
    orientation: str = "horizontal"
    size: str = "md"
    variant: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<UTabs class="tux-tabs">{content}</UTabs>'
