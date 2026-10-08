"""
TuxResearcher — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxResearcher:
    name: Optional[str] = None
    role: Optional[str] = None
    portrait: Optional[str] = None
    center: Optional[str] = None
    orcid: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    projects: Optional[str] = None
    metrics: Optional[str] = None
    layout: str = "default"
    to: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-researcher">{content}</article>'
