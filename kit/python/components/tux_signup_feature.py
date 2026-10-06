"""
TuxSignupFeature — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxSignupFeature:
    title: str = None
    eyebrow: str = "undefined"
    dek: str = "undefined"
    action_label: str = "Subscribe"
    placeholder: str = "your@email.edu"
    consent: str = "We"
    model_value: str = None
    tone: str = neutral
    variant: str = default

    def render_html(self, content: str = "") -> str:
        return f'<section class="tux-signup-feature">{content}</section>'
