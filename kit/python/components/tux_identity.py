"""
TuxIdentity — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxIdentity:
    name: Optional[str] = None
    superhead: Optional[str] = None
    level: str = "institution"
    orientation: str = "horizontal"
    kind: str = "lockup"
    href: Optional[str] = None
    logo_size: int = 0

    def render_html(self, content: str = "") -> str:
        return f'<div class="tux-identity">{content}</div>'
