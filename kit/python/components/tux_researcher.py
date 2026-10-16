"""
TuxResearcher — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxResearcher:
    name: str = None
    role: str = None
    portrait: str = None
    center: str = None
    orcid: str = None
    email: str = None
    bio: str = None
    projects: str = None
    metrics: str = None
    layout: str = "default"
    to: str = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-researcher">{content}</article>'
