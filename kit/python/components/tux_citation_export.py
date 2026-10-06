"""
TuxCitationExport — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCitationExport:
    citation: str = None
    label: str = "Cite"
    variant: str = outline

    def render_html(self, content: str = "") -> str:
        return f'<UDropdownMenu class="tux-citation-export">{content}</UDropdownMenu>'
