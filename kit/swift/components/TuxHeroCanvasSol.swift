// TuxHeroCanvasSol.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxHeroCanvasSol<Content: View>: View {
    public var blend: String = "seamless"
    public var interactive: Bool = true
    public var showControls: Bool = true
    public var minHeight: String = "34rem"
    public var mode: String = "adaptive"
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
