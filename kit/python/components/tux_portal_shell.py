"""
TuxPortalShell — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPortalShell:
    portal_title: str = ""
    portal_badge: str = ""
    portal_badge_variant: str = "gold"
    nav_items: Optional[str] = None
    action_text: str = ""
    action_to: str = ""
    action_href: str = ""
    utility_links: Optional[str] = None
    agency_name: str = "Texas A&M Transportation Institute"
    agency_url: str = "https://tti.tamu.edu"
    home_url: str = "/"
    show_search: bool = True
    sticky_header: bool = True
    breadcrumbs: Optional[str] = None
    max_width: str = "standard"
    show_feedback: bool = True
    feedback_label: str = "Feedback"
    show_footer: bool = True
    header_props: Optional[str] = None
    footer_props: Optional[str] = None
    main_class: str = "py-8"
    as_: str = "main"

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-portal-shell">{content}</div>'
