// TuxChartHeatmap.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartHeatmap<Content: View>: View {
    public var rows: String
    public var cols: String
    public var values: String
    public var width: Int = 640
    public var height: Int = 280
    public var ramp: String = maroon
    public var bins: String = 5
    public var valueLabels: Bool = false
    public var legend: Bool = true
    public var colLabelEvery: Int = 0
    public var format: String = "(n:"
    public var decimals: Int = 1
    public var ariaSummary: String = "undefined"
    public var units: String = "undefined"
    public var tooltip: Bool = true
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
