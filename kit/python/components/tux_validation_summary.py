"""
TuxValidationSummary — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxValidationSummary:
    errors: Optional[str] = None
    title: str = "Please fix the following before submitting:"
    variant: str = "error"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-validation-summary">{content}</div>'
