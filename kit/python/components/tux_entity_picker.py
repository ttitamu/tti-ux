"""
TuxEntityPicker — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxEntityPicker:
    model_value: Optional[str] = None
    options: Optional[str] = None
    label: Optional[str] = None
    placeholder: str = "Search by code, title, or owner…"
    clearable: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-entity-picker">{content}</div>'
