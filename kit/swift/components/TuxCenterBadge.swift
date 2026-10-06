// TuxCenterBadge.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCenterBadge<Content: View>: View {
    public var center: String = undefined
    public var label: String = "undefined"
    public var icon: String = "undefined"
    public var toneIndex: Int = 2
    public var short: Bool = false
    public var size: String = md
    public var layout: String = chip
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
