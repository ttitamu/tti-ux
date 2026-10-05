// TuxChartGeoChoroplethLegend.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartGeoChoroplethLegend<Content: View>: View {
    public var ramp: String
    public var label: String
    public var stops: String
    public var x: Int
    public var y: Int
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
