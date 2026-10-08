"""
TuxProse — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass

@dataclass
class TuxProse:
    as_: str = "article"

    def render_html(self, content: str = "") -> str:
        return f'<component class="tux-prose">{content}</component>'
