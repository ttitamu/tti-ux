"""
TuxTeachingPopover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTeachingPopover:
    model_value: bool = false
    step: int = 1
    total_steps: int = 1
    title: str = "undefined"
    on_brand: bool = false
    no_dismiss: bool = false
    primary_label: str = "undefined"
    secondary_label: str = "Skip"
    no_secondary: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<Teleport class="tux-teaching-popover">{content}</Teleport>'
