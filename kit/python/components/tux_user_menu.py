"""
TuxUserMenu — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxUserMenu:
    state: Optional[str] = None
    identity: Optional[str] = None
    sign_in_href: Optional[str] = None
    sign_in_label: Optional[str] = None
    items: Optional[str] = None
    prefs: Optional[str] = None
    show_sign_out: bool = True
    placement: str = "cluster"
    status_line: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-user-menu">{content}</div>'
