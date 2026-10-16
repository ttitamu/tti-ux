"""
TuxCommHero — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCommHero:
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    accent_title: Optional[str] = None
    lead: Optional[str] = None
    primary_action_text: Optional[str] = None
    primary_action_to: Optional[str] = None
    primary_action_href: Optional[str] = None
    secondary_action_text: Optional[str] = None
    secondary_action_to: Optional[str] = None
    secondary_action_href: Optional[str] = None
    image_src: Optional[str] = None
    image_alt: Optional[str] = None
    image_badge: Optional[str] = None
    chamfer: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-comm-hero">{content}</section>'
