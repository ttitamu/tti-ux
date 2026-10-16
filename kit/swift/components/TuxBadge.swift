// TuxBadge.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBadge<Content: View>: View {
    public var tier: String
    public var status: String
    public var tone: String
    public var kind: String = "default"
    public var variant: String
    public var bold: Bool = false
    public var dot: Bool = false
    public var icon: String
    public var count: String
    public var label: String
    public var uppercase: Bool = false
    public var shape: String = "default"
    public var glyph: Bool = false
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
