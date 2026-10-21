// TuxSidebarBlock.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSidebarBlock<Content: View>: View {
    public var title: String? = nil
    public var eyebrow: String? = nil
    public var icon: String? = nil
    public var variant: String = "default"
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
