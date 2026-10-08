"""
TuxTeachingPopover — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxTeachingPopover:
    model_value: bool = False
    step: int = 1
    total_steps: int = 1
    title: Optional[str] = None
    on_brand: bool = False
    no_dismiss: bool = False
    primary_label: Optional[str] = None
    secondary_label: str = "Skip"
    no_secondary: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<Teleport class="tux-teaching-popover">{content}</Teleport>'
