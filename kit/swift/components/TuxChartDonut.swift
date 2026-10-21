// TuxChartDonut.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartDonut<Content: View>: View {
    public var slices: String? = nil
    public var size: Int = 280
    public var palette: String = "brand"
    public var patterns: Bool = false
    public var thickness: Double = 0.5
    public var sliceLabels: Bool = true
    public var legend: Bool = false
    public var centerLabel: String? = nil
    public var centerValue: String? = nil
    public var minSlice: Int = 3
    public var format: String? = nil
    public var decimals: Int = 1
    public var ariaSummary: String? = nil
    public var units: String? = nil
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
