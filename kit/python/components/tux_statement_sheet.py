"""
TuxStatementSheet — Python component & Streamlit / Dash renderer.
Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class TuxStatementSheet:
    statement_id: Optional[str] = None
    title: str = "Resource Chargeback Statement"
    period_label: Optional[str] = None
    issue_date: Optional[str] = None
    status: str = "settled"
    issuer: Optional[str] = None
    recipient: Optional[str] = None
    lines: Optional[str] = None
    adjustments: Optional[str] = None
    approvals: Optional[str] = None
    remittance_ref: Optional[str] = None
    digest: Optional[str] = None
    currency_symbol: str = "$"
    show_print_action: bool = True

    def render_html(self, content: str = "") -> str:
        return f'<article class="tux-statement-sheet">{content}</article>'
