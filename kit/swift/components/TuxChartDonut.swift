// TuxChartDonut.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartDonut<Content: View>: View {
    public var slices: String
    public var size: Int = 280
    public var thickness: Int = 0.5
    public var sliceLabels: Bool = true
    public var legend: Bool = false
    public var centerLabel: String = "undefined"
    public var centerValue: String = undefined
    public var minSlice: Int = 3
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
