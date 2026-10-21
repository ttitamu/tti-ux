"""
TuxFooter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFooter:
    name: str = "Texas A&M Transportation Institute"
    address: str = "Texas A&M Transportation Institute\nCollege Station, TX 77843"
    phone: str = "(979) 317-2000"
    logo: str = "/logo.svg"
    logo_size: int = 80
    brand_lockup: str = "/TTI_white.png"
    brand_lockup_alt: str = "Texas A&M Transportation Institute"
    social: Optional[str] = None
    columns: Optional[str] = None
    tagline: str = "Coordinated Statewide Transportation Research Program"
    year: Optional[int] = None

    def render_html(self, content: str = "") -> str:
        return f'<footer class="tux-footer">{content}</footer>'
