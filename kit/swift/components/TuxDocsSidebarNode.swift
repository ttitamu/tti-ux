// TuxDocsSidebarNode.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxDocsSidebarNode<Content: View>: View {
    public var section: String
    public var path: String
    public var query: String
    public var openMap: String
    public var isOpen: String
    public var isActive: String
    public var onToggle: String
    public var depth: Int
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
