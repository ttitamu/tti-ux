"""
TuxConfirmDialog — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxConfirmDialog:
    open: bool = false
    title: str = None
    eyebrow: str = None
    confirm_label: str = None
    cancel_label: str = "Cancel"
    variant: str = "destructive"
    confirm_disabled: bool = false
    loading: bool = false
    size: str = "sm"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-confirm-dialog">{content}</div>'
