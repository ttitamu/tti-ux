"""
TuxRecordMatcher — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxRecordMatcher:
    items: Optional[str] = None
    allow_rule_creation: bool = True
    rule_checkbox_label: str = "Remember this mapping rule for future records"
    accept_label: str = "Confirm Match"
    dismiss_label: str = "Defer"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-record-matcher">{content}</div>'
