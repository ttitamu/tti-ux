"""
TuxFilterPanel — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFilterPanel:
    facets: Optional[str] = None
    model_value: Optional[str] = None
    title: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<aside class="tux-filter-panel">{content}</aside>'
