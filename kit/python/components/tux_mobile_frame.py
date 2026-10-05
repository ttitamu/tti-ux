"""
TuxMobileFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxMobileFrame:
    platform: str = "ios"
    width: int = 280
    color: str = undefined
    status_bar: bool = true
    time: str = "9:41"
    notch: bool = true
    home_indicator: bool = true
    nav_style: str = "gesture"
    aria_label: str = "undefined"

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-mobile-frame">{content}</figure>'
