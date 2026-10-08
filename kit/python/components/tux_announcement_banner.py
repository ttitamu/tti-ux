"""
TuxAnnouncementBanner — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAnnouncementBanner:
    id: Optional[str] = None
    tone: str = "info"
    icon: Optional[str] = None
    eyebrow: Optional[str] = None
    message: Optional[str] = None
    action: Optional[str] = None
    dismissable: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<Transition class="tux-announcement-banner">{content}</Transition>'
