// TuxChartGeoChoroplethLegend.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartGeoChoroplethLegend<Content: View>: View {
    public var ramp: String? = nil
    public var label: String? = nil
    public var stops: String? = nil
    public var x: Int? = nil
    public var y: Int? = nil
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
