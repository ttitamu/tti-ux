"""
TuxPortalHeader — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPortalHeader:
    mode: str = comm
    agency_name: str = "Texas"
    agency_url: str = "https://tti.tamu.edu"
    home_url: str = "/"
    portal_title: str = None
    portal_badge: str = None
    portal_badge_variant: str = gold
    utility_links: str = "()"
    show_search: bool = true
    show_spectrum_ribbon: bool = false
    intranet_apps: str = "()"

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-portal-header">{content}</header>'
