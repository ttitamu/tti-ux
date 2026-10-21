// TuxTreeNode.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTreeNode<Content: View>: View {
    public var node: String? = nil
    public var depth: Int? = nil
    public var selectedId: String? = nil
    public var isExpanded: String? = nil
    public var showGuides: Bool = false
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
