// TuxReactionBar.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxReactionBar<Content: View>: View {
    public var modelValue: String? = nil
    public var reactions: String? = nil
    public var counts: String? = nil
    public var size: String = "md"
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
