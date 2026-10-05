"""
TuxSplashScreen — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSplashScreen:
    loaded: bool = false
    status: str = "Loading…"
    hidden: bool = false
    fade_delay: int = 300

    def render_html(self, content: str = "") -> str:
        return f'<Transition class="tux-splash-screen">{content}</Transition>'
