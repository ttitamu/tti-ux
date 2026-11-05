// TuxResourceMeter.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxResourceMeter<Content: View>: View {
    public var title: String? = nil
    public var subtitle: String? = nil
    public var poolStatus: String = "ok"
    public var channels: String? = nil
    public var wasteThresholdRatio: Double = 0.35
    public var saturationThresholdRatio: Double = 0.85
    public var reclaimLabel: String = "Reclaim Idle"
    public var showReclaimAction: Bool = true
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
