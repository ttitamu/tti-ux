// TuxChartScatter.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartScatter<Content: View>: View {
    public var series: String
    public var xLabel: String = "x"
    public var yLabel: String = "y"
    public var width: Int = 640
    public var height: Int = 320
    public var trendline: Bool = false
    public var legend: Bool = true
    public var gridlines: Bool = true
    public var xTicks: Int = 6
    public var yTicks: Int = 5
    public var format: String = "(n:"
    public var decimals: Int = 2
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
