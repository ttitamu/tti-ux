"""
TuxSignupFeature — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSignupFeature:
    title: Optional[str] = None
    eyebrow: Optional[str] = None
    dek: Optional[str] = None
    action_label: str = "Subscribe"
    placeholder: str = "your@email.edu"
    consent: str = "We never share your address. Unsubscribe in one click."
    model_value: str = ""
    tone: str = "neutral"
    variant: str = "default"

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-signup-feature">{content}</section>'
