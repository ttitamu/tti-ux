"""
TuxAppFrame — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxAppFrame:
    title: str = "undefined"
    eyebrow: str = "undefined"
    use_system_accent: bool = false
    unified_toolbar: bool = true
    force_chrome: bool = false

    def render_html(self, content: str = "") -> str:
        return f'<header class="tux-app-frame">{content}</header>'
