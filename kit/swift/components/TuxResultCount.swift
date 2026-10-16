// TuxResultCount.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxResultCount<Content: View>: View {
    public var page: Int
    public var pageSize: Int
    public var total: Int
    public var noun: String
    public var nounPlural: String
    public var pageSizeOptions: String
    public var hideRange: Bool = false
    public var pageSizeLabel: String
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
