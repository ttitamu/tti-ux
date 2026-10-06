// TuxChartGeographic.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartGeographic<Content: View>: View {
    public var kind: String
    public var palette: String = "maroon"
    public var title: String
    public var legendLabel: String = "Value"
    public var legendStops: String = "()"
    public var showLegend: Bool = true
    public var counties: String = "()"
    public var districts: String = "()"
    public var states: String = "()"
    public var highlight: String = "TX"
    public var dots: Int = 600
    public var dotLegend: String = "1"
    public var flows: String = "()"
    public var flowLegend: String = "Daily"
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
