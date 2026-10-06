"""
TuxCTA — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCTA:
    eyebrow: str = null
    title: str = None
    dek: str = null
    tone: str = maroon
    variant: str = default

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-cta">{content}</section>'
