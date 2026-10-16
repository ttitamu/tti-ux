"""
TuxPortalHeader — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPortalHeader:
    mode: str = "comm"
    agency_name: Optional[str] = None
    agency_url: str = "https://tti.tamu.edu"
    home_url: str = "/"
    portal_title: Optional[str] = None
    portal_badge: Optional[str] = None
    portal_badge_variant: str = "gold"
    utility_links: Optional[str] = None
    show_search: bool = True
    show_spectrum_ribbon: bool = False
    intranet_apps: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-portal-header">{content}</header>'
