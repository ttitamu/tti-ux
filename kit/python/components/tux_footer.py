"""
TuxFooter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFooter:
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    logo: str = "/logo.svg"
    logo_size: int = 80
    brand_lockup: str = "/TTI_white.png"
    brand_lockup_alt: Optional[str] = None
    social: Optional[str] = None
    columns: Optional[str] = None
    tagline: Optional[str] = None
    year: Optional[int] = None

    def render_html(self, content: str = "") -> str:
        return f'<footer class="tux-footer">{content}</footer>'
