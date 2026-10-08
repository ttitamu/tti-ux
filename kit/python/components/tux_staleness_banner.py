"""
TuxStalenessBanner — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStalenessBanner:
    stale: bool = False
    verified_until: Optional[str] = None
    last_verified: Optional[str] = None
    review_cadence_days: int = 90
    owner: Optional[str] = None
    page_id: Optional[str] = None
    dismissable: bool = True
    show_verified_badge: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-staleness-banner">{content}</div>'
