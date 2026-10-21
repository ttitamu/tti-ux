// TuxAlphaNav.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAlphaNav<Content: View>: View {
    public var letters: String? = nil
    public var available: String? = nil
    public var mode: String = "anchor"
    public var sticky: Bool = false
    public var showAll: Bool = false
    public var modelValue: String? = nil
    public var ariaLabel: String = "Jump to letter"
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
