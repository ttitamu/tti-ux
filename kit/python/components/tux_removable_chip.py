"""
TuxRemovableChip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRemovableChip:
    icon: str = "undefined"
    removable: bool = false
    size: str = md
    selected: bool = false
    disabled: bool = false
    remove_label: str = "undefined"
    click_to_remove: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-removable-chip">{content}</span>'
