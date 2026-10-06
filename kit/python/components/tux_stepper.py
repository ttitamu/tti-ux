"""
TuxStepper — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStepper:
    steps: str = None
    current_index: int = 0
    orientation: str = horizontal
    show_descriptions: bool = true
    aria_label: str = "Progress"

    def render_html(self, content: str = "") -> str:
        return f'<nav class="tux-stepper">{content}</nav>'
