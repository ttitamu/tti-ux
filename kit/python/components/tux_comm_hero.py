"""
TuxCommHero — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCommHero:
    eyebrow: str = "TEXAS A&M TRANSPORTATION INSTITUTE"
    title: Optional[str] = None
    accent_title: str = ""
    lead: str = ""
    primary_action_text: str = ""
    primary_action_to: str = ""
    primary_action_href: str = ""
    secondary_action_text: str = ""
    secondary_action_to: str = ""
    secondary_action_href: str = ""
    image_src: str = ""
    image_alt: str = "TTI Research Facility and Operations"
    image_badge: str = ""
    chamfer: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-comm-hero">{content}</section>'
