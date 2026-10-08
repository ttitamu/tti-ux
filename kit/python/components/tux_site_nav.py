"""
TuxSiteNav — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSiteNav:
    identity: Optional[str] = None
    primary_nav: str = "()"
    utility_nav: str = "()"
    search: bool = False
    sticky: bool = False
    aria_label: str = "Primary"

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-site-nav">{content}</header>'
