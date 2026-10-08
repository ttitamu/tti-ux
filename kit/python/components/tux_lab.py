"""
TuxLab — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxLab:
    name: Optional[str] = None
    summary: Optional[str] = None
    logo: Optional[str] = None
    projects_count: Optional[int] = None
    people_count: Optional[int] = None
    location: Optional[str] = None
    leaders: Optional[str] = None
    focus: Optional[str] = None
    to: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-lab">{content}</article>'
