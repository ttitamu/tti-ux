// TuxLedgerTable.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxLedgerTable<Content: View>: View {
    public var caption: String? = nil
    public var groups: String? = nil
    public var valuePrefix: String = ""
    public var valueSuffix: String = ""
    public var decimals: Int = 2
    public var showQuantityRate: Bool = true
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
