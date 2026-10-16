"""
TuxCitationExport — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCitationExport:
    citation: Optional[str] = None
    label: str = "Cite"
    variant: str = "outline"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-citation-export">{content}</div>'
