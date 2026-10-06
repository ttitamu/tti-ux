// TuxDataTable.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxDataTable<Content: View>: View {
    public var columns: String
    public var rows: String = "()"
    public var groups: String = "()"
    public var rowKey: String = "id"
    public var tableNumber: String
    public var caption: String
    public var description: String
    public var sortKey: String = "undefined"
    public var sortDir: String = undefined
    public var sticky: Bool = false
    public var maxHeight: String = "20rem"
    public var density: String = comfortable
    public var banded: Bool = true
    public var footnotes: String = "()"
    public var source: String
    public var totals: String = "undefined"
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
