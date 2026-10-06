"""
TuxPortalShell — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxPortalShell:
    portal_title: str = None
    portal_badge: str = None
    portal_badge_variant: str = gold
    nav_items: str = "()"
    action_text: str = None
    action_to: str = None
    action_href: str = None
    utility_links: str = None
    agency_name: str = "Texas"
    agency_url: str = "https://tti.tamu.edu"
    home_url: str = "/"
    show_search: bool = true
    sticky_header: bool = true
    breadcrumbs: str = "()"
    max_width: str = standard
    show_feedback: bool = true
    feedback_label: str = "Feedback"
    show_footer: bool = true
    header_props: str = "()"
    footer_props: str = None
    main_class: str = None
    as: str = None

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-portal-shell">{content}</div>'
