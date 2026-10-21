// TuxLoadMore.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxLoadMore<Content: View>: View {
    public var loaded: Int? = nil
    public var total: Int? = nil
    public var loading: Bool = false
    public var noun: String? = nil
    public var nounPlural: String? = nil
    public var label: String = "Load more"
    public var terminalLabel: String = "All loaded"
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
