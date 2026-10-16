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
    color: Optional[str] = None
    status_bar: bool = True
    time: str = "9:41"
    notch: bool = True
    home_indicator: bool = True
    nav_style: str = "gesture"
    aria_label: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<figure class="tux-mobile-frame">{content}</figure>'
