"""
TuxSplashScreen — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass

@dataclass
class TuxSplashScreen:
    loaded: bool = False
    status: str = "Loading…"
    hidden: bool = False
    fade_delay: int = 300

    def render_html(self, content: str = "") -> str:
        return f'<Transition class="tux-splash-screen">{content}</Transition>'
