"""
TuxRemovableChip — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRemovableChip:
    icon: Optional[str] = None
    removable: bool = False
    size: str = "md"
    selected: bool = False
    disabled: bool = False
    remove_label: Optional[str] = None
    click_to_remove: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<span class="tux-removable-chip">{content}</span>'
