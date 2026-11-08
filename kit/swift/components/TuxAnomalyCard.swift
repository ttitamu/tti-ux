// TuxAnomalyCard.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAnomalyCard<Content: View>: View {
    public var id: String = "anomaly-card"
    public var title: String? = nil
    public var metricLabel: String? = nil
    public var currentValue: String? = nil
    public var baselineLabel: String? = nil
    public var deltaLabel: String? = nil
    public var projectionLabel: String? = nil
    public var severity: String = "critical"
    public var state: String = "open"
    public var ruleSummary: String? = nil
    public var series: String? = nil
    public var targetEntity: String? = nil
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
