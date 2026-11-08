// TuxUptimeStrip.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxUptimeStrip<Content: View>: View {
    public var serviceName: String? = nil
    public var serviceGroup: String? = nil
    public var buckets: String? = nil
    public var windowLabel: String = "Last 30 days"
    public var slaTargetPct: Double = 99.9
    public var currentLatencyMs: Int? = nil
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
