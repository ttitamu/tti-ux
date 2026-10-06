"""
TuxFundingSource — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFundingSource:
    funder: str = None
    abbrev: str = "undefined"
    logo: str = "undefined"
    grant: str = "undefined"
    to: str = "undefined"
    size: str = md
    layout: str = inline

    def render_html(self, content: str = "") -> str:
        return f'<component class="tux-funding-source">{content}</component>'
