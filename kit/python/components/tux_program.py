"""
TuxProgram — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxProgram:
    name: str = None
    eyebrow: str = None
    summary: str = None
    hero: str = None
    leads: str = None
    funders: str = None
    metrics: str = None

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-program">{content}</article>'
