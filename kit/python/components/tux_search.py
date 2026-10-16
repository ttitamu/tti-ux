"""
TuxSearch — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSearch:
    model_value: Optional[str] = None
    variant: str = "field"
    block_bar: str = "field"
    size: str = "regular"
    placeholder: str = "Search"
    heading: Optional[str] = None
    lede: Optional[str] = None
    aria_label: Optional[str] = None
    action_label: str = "Search"
    action_icon: Optional[str] = None
    leading_icon: str = "lucide:search"
    clearable: bool = True
    loading: bool = False
    disabled: bool = False
    corner_drop: bool = False
    force_focus: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-search">{content}</div>'
