// TuxDocsSidebarNode.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxDocsSidebarNode<Content: View>: View {
    public var section: String? = nil
    public var path: String? = nil
    public var query: String? = nil
    public var openMap: String? = nil
    public var isOpen: String? = nil
    public var isActive: String? = nil
    public var onToggle: String? = nil
    public var depth: Int? = nil
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
