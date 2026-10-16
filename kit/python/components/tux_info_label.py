"""
TuxInfoLabel — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxInfoLabel:
    for: str = None
    required: bool = false
    trigger: str = "hover"
    info_aria_label: str = None

    def render_html(self, content: str = "") -> str:
        return f'<label class="tux-info-label">{content}</label>'
