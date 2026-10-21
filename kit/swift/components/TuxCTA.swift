// TuxCTA.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCTA<Content: View>: View {
    public var eyebrow: String? = nil
    public var title: String? = nil
    public var dek: String? = nil
    public var tone: String = "maroon"
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
