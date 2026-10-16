"""
TuxFooter — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxFooter:
    name: str = None
    address: str = None
    phone: str = None
    logo: str = "/logo.svg"
    logo_size: int = 80
    brand_lockup: str = "/TTI_white.png"
    brand_lockup_alt: str = None
    social: str = None
    columns: str = None
    tagline: str = None
    year: int = None

    def render_html(self, content: str = "") -> str:
        return f'<footer class="tux-footer">{content}</footer>'
