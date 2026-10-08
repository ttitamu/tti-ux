"""
TuxCookieConsent — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass

@dataclass
class TuxCookieConsent:
    storage_key: str = "tux-cookie-consent"
    position: str = "bottom-right"
    message: str = "We"
    privacy_href: str = "/privacy"
    initially_expanded: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<Teleport class="tux-cookie-consent">{content}</Teleport>'
