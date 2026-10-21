// TuxChartGauge.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartGauge<Content: View>: View {
    public var value: Int? = nil
    public var min: Int = 0
    public var max: Int = 100
    public var size: Int = 240
    public var variant: String = "arc"
    public var bands: String? = nil
    public var centerLabel: String? = nil
    public var centerValue: String? = nil
    public var units: String? = nil
    public var format: String? = nil
    public var decimals: Int = 1
    public var ariaSummary: String? = nil
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
