"""
TuxCookieConsent — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCookieConsent:
    storage_key: str = "tux-cookie-consent"
    position: str = "bottom-right"
    message: Optional[str] = None
    privacy_href: str = "/privacy"
    initially_expanded: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-cookie-consent">{content}</div>'
