"""
TuxPortalShell — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPortalShell:
    portal_title: Optional[str] = None
    portal_badge: Optional[str] = None
    portal_badge_variant: str = "gold"
    nav_items: str = "()"
    action_text: Optional[str] = None
    action_to: Optional[str] = None
    action_href: Optional[str] = None
    utility_links: Optional[str] = None
    agency_name: str = "Texas"
    agency_url: str = "https://tti.tamu.edu"
    home_url: str = "/"
    show_search: bool = True
    sticky_header: bool = True
    breadcrumbs: str = "()"
    max_width: str = "standard"
    show_feedback: bool = True
    feedback_label: str = "Feedback"
    show_footer: bool = True
    header_props: str = "()"
    footer_props: Optional[str] = None
    main_class: Optional[str] = None
    as_: Optional[str] = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-portal-shell">{content}</div>'
