// TuxMapLegend.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxMapLegend<Content: View>: View {
    public var title: String? = nil
    public var eyebrow: String? = nil
    public var entries: String? = nil
    public var layout: String = "stacked"
    public var gradient: String? = nil
    public var minLabel: String? = nil
    public var maxLabel: String? = nil
    public var css: String? = nil
    public var stops: String? = nil
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
