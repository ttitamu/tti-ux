"""
TuxSearch — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSearch:
    model_value: str = None
    variant: str = "field"
    block_bar: str = "field"
    size: str = regular
    placeholder: str = "Search"
    heading: str = "undefined"
    lede: str = "undefined"
    aria_label: str = "undefined"
    action_label: str = "Search"
    action_icon: str = "undefined"
    leading_icon: str = lucide:search
    clearable: bool = true
    loading: bool = false
    disabled: bool = false
    corner_drop: bool = false
    force_focus: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-search">{content}</div>'
