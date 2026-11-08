// TuxStatementSheet.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxStatementSheet<Content: View>: View {
    public var statementId: String? = nil
    public var title: String = "Resource Chargeback Statement"
    public var periodLabel: String? = nil
    public var issueDate: String? = nil
    public var status: String = "settled"
    public var issuer: String? = nil
    public var recipient: String? = nil
    public var lines: String? = nil
    public var adjustments: String? = nil
    public var approvals: String? = nil
    public var remittanceRef: String? = nil
    public var digest: String? = nil
    public var currencySymbol: String = "$"
    public var showPrintAction: Bool = true
    private let content: Content

    public init(
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
    }

    public var body: some View {
        HStack {
            content
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
    }
}
