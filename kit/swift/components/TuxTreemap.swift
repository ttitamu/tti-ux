// TuxTreemap.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTreemap<Content: View>: View {
    public var data: String
    public var width: Int = 720
    public var height: Int = 460
    public var maxDepth: Int = 2
    public var colorBy: String = size
    public var unit: String = bytes
    public var ariaLabel: String = "Treemap"
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
