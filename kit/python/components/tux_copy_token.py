"""
TuxCopyToken — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass

@dataclass
class TuxCopyToken:
    pass

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-copy-token">{content}</span>'
