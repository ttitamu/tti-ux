// TuxChartSunburst.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChartSunburst<Content: View>: View {
    public var data: String
    public var size: Int = 320
    public var centerLabel: String = "Total"
    public var formatTotal: String = "undefined"
    public var formatValue: String = "undefined"
    public var showLegend: Bool = true
    public var palette: String = "undefined"
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
