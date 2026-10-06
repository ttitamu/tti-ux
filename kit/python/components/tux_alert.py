"""
TuxAlert — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAlert:
    variant: str = "info"
    title: str = "undefined"
    description: str = "undefined"
    icon: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<UAlert class="tux-alert">{content}</UAlert>'
