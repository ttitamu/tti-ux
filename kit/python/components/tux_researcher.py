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
    portrait: str = "undefined"
    center: str = "undefined"
    orcid: str = "undefined"
    email: str = "undefined"
    bio: str = "undefined"
    projects: str = "undefined"
    metrics: str = "undefined"
    layout: str = default
    to: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-researcher">{content}</article>'
