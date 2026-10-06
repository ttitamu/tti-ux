// TuxInfiniteScroll.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxInfiniteScroll<Content: View>: View {
    public var loaded: Int
    public var total: Int
    public var loading: Bool = false
    public var keyboardFallback: Bool = false
    public var rootMargin: String = "200px"
    public var noun: String = "undefined"
    public var nounPlural: String = "undefined"
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
