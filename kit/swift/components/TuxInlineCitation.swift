// TuxInlineCitation.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxInlineCitation<Content: View>: View {
    public var n: Int? = nil
    public var title: String? = nil
    public var href: String? = nil
    public var excerpt: String? = nil
    public var score: String? = nil
    public var label: String? = nil
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
