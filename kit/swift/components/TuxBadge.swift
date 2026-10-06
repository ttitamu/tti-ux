// TuxBadge.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBadge<Content: View>: View {
    public var tier: String = "undefined"
    public var status: String = "undefined"
    public var tone: String = "undefined"
    public var kind: String = "default"
    public var variant: String = "undefined"
    public var bold: Bool = false
    public var dot: Bool = false
    public var icon: String = "undefined"
    public var count: String = undefined
    public var label: String = "undefined"
    public var uppercase: Bool = false
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
