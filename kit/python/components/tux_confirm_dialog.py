"""
TuxConfirmDialog — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxConfirmDialog:
    open: bool = False
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    confirm_label: Optional[str] = None
    cancel_label: str = "Cancel"
    variant: str = "destructive"
    confirm_disabled: bool = False
    loading: bool = False
    size: str = "sm"

    def render_html(self, content: str = "") -> str:
        return f'<TuxModal class="tux-confirm-dialog">{content}</TuxModal>'
