"""
TuxButton — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxButton:
    intent: str = "primary"
    shape: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<UButton class="tux-button">{content}</UButton>'
