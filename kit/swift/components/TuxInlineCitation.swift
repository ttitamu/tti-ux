// TuxInlineCitation.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxInlineCitation<Content: View>: View {
    public var n: Int
    public var title: String
    public var href: String = "undefined"
    public var excerpt: String = "undefined"
    public var score: String = undefined
    public var label: String = "undefined"
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
