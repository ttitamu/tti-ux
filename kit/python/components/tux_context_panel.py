"""
TuxContextPanel — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxContextPanel:
    width: str = 320

    def render_html(self, content: str = "") -> str:
        return f'<aside class="tux-context-panel">{content}</aside>'
