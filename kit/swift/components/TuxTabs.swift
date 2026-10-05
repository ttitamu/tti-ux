// TuxTabs.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTabs<Content: View>: View {
    public var items: String
    public var modelValue: String = undefined
    public var orientation: String = horizontal
    public var size: String = md
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
