"""
TuxProse — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxProse:
    as: str = "article"

    def render_html(self, content: str = "") -> str:
        return f'<component class="tux-prose">{content}</component>'
