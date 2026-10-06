// TuxInfoLabel.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxInfoLabel<Content: View>: View {
    public var for: String = "undefined"
    public var required: Bool = false
    public var trigger: String = hover
    public var infoAriaLabel: String = "More"
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
