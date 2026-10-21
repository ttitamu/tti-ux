// TuxChartGeographic.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartGeographic<Content: View>: View {
    public var kind: String? = nil
    public var palette: String = "maroon"
    public var title: String = ""
    public var legendLabel: String = "Value"
    public var legendStops: String? = nil
    public var showLegend: Bool = true
    public var counties: String? = nil
    public var districts: String? = nil
    public var states: String? = nil
    public var highlight: String = "TX"
    public var dots: Int = 600
    public var dotLegend: String = "1 dot = 100 incidents"
    public var flows: String? = nil
    public var flowLegend: String = "Daily trips (thousands)"
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
