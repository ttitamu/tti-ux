// TuxChartLine.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartLine<Content: View>: View {
    public var labels: String
    public var series: String
    public var width: Int = 640
    public var height: Int = 280
    public var markers: Bool = false
    public var endLabels: Bool = true
    public var legend: Bool = false
    public var gridlines: Bool = true
    public var yTicks: Int = 5
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
