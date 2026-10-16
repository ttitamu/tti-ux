"""
TuxAppFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAppFrame:
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    use_system_accent: bool = False
    unified_toolbar: bool = True
    force_chrome: bool = False

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-app-frame">{content}</header>'
