"""
TuxProgram — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxProgram:
    name: Optional[str] = None
    eyebrow: Optional[str] = None
    summary: Optional[str] = None
    hero: Optional[str] = None
    leads: Optional[str] = None
    funders: Optional[str] = None
    metrics: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-program">{content}</article>'
