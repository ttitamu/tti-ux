// TuxBadge.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBadge<Content: View>: View {
    public var tier: String? = nil
    public var status: String? = nil
    public var tone: String? = nil
    public var kind: String = "default"
    public var variant: String? = nil
    public var bold: Bool = false
    public var dot: Bool = false
    public var icon: String? = nil
    public var count: String? = nil
    public var label: String? = nil
    public var uppercase: Bool = false
    public var shape: String = "default"
    public var glyph: Bool = false
    public var los: String? = nil
    public var division: String? = nil
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
