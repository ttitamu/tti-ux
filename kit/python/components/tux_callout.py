"""
TuxCallout — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCallout:
    kind: str = fact
    eyebrow: str = null
    variant: str = default

    def render_html(self, content: str = "") -> str:
        return f'<aside class="tux-callout">{content}</aside>'
