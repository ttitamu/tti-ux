"""
TuxIdentity — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxIdentity:
    name: str = None
    superhead: str = null
    level: str = institution
    orientation: str = horizontal
    kind: str = lockup
    href: str = null
    logo_size: int = 0

    def render_html(self, content: str = "") -> str:
        return f'<component class="tux-identity">{content}</component>'
