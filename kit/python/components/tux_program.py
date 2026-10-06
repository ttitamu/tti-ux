"""
TuxProgram — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxProgram:
    name: str = None
    eyebrow: str = "undefined"
    summary: str = "undefined"
    hero: str = "undefined"
    leads: str = "undefined"
    funders: str = "undefined"
    metrics: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-program">{content}</article>'
