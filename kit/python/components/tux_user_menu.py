"""
TuxUserMenu — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxUserMenu:
    state: str = None
    identity: str = None
    sign_in_href: str = None
    sign_in_label: str = None
    items: str = None
    prefs: str = None
    show_sign_out: bool = true
    placement: str = "cluster"
    status_line: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-user-menu">{content}</div>'
