"""
TuxFundingSource — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFundingSource:
    funder: Optional[str] = None
    abbrev: Optional[str] = None
    logo: Optional[str] = None
    grant: Optional[str] = None
    to: Optional[str] = None
    size: str = "md"
    layout: str = "inline"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-funding-source">{content}</div>'
