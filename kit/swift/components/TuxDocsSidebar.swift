// TuxDocsSidebar.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxDocsSidebar<Content: View>: View {
    public var tree: String
    public var title: String = "Docs"
    public var search: Bool = true
    public var searchPlaceholder: String = "Filter"
    public var storageKey: String = tux-docs-sidebar
    public var exclusiveTopLevel: Bool = false
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
