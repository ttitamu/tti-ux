// TuxSkeleton.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSkeleton<Content: View>: View {
    public var kind: String = "primitive"
    public var variant: String = "block"
    public var width: String = "100%"
    public var height: String = "undefined"
    public var radius: String = "undefined"
    public var count: Int = 3
    public var animated: String = "shimmer"
    public var label: String = "Loading…"
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
