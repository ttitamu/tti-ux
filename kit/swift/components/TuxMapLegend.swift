// TuxMapLegend.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMapLegend<Content: View>: View {
    public var title: String = "undefined"
    public var eyebrow: String = "undefined"
    public var entries: String = "undefined"
    public var layout: String = stacked
    public var gradient: String = "undefined"
    public var minLabel: String
    public var maxLabel: String
    public var css: String
    public var stops: String
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
