// TuxLoadMore.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxLoadMore<Content: View>: View {
    public var loaded: Int
    public var total: Int
    public var loading: Bool = false
    public var noun: String
    public var nounPlural: String
    public var label: String
    public var terminalLabel: String
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
