// TuxRecordHighlights.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRecordHighlights<Content: View>: View {
    public var title: String
    public var eyebrow: String = "undefined"
    public var icon: String = "undefined"
    public var items: String = "()"
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
