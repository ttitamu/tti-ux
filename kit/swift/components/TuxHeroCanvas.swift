// TuxHeroCanvas.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxHeroCanvas<Content: View>: View {
    public var variant: String = wash
    public var blend: String = seamless
    public var interactive: Bool = true
    public var showControls: Bool = true
    public var minHeight: String = "32rem"
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
