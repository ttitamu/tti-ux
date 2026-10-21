// TuxStatComparison.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxStatComparison<Content: View>: View {
    public var eyebrow: String? = nil
    public var current: Int? = nil
    public var previous: Int? = nil
    public var suffix: String? = nil
    public var label: String? = nil
    public var layout: String = "row"
    public var decimals: Int = 1
    public var polarity: String = "direct"
    public var deltaFormat: String = "abs+pct"
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
