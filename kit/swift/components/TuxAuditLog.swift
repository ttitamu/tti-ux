// TuxAuditLog.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAuditLog<Content: View>: View {
    public var title: String = "Immutable Governance Audit Log"
    public var entries: String? = nil
    public var searchable: Bool = true
    public var initialCategory: String = "all"
    public var exportable: Bool = true
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
