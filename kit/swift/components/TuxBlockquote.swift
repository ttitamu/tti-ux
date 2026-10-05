// TuxBlockquote.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBlockquote<Content: View>: View {
    public var quote: String
    public var attribution: String = null
    public var role: String = null
    public var layout: String = centered
    public var variant: String = default
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
