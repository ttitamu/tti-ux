"""
TuxCommHero — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxCommHero:
    eyebrow: str = "TEXAS"
    title: str = None
    accent_title: str = None
    lead: str = None
    primary_action_text: str = None
    primary_action_to: str = None
    primary_action_href: str = None
    secondary_action_text: str = None
    secondary_action_to: str = None
    secondary_action_href: str = None
    image_src: str = None
    image_alt: str = "TTI"
    image_badge: str = None
    chamfer: bool = true

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-comm-hero">{content}</section>'
