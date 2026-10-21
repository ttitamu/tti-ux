// TuxBigStat.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBigStat<Content: View>: View {
    public var value: String? = nil
    public var suffix: String? = nil
    public var label: String? = nil
    public var source: String? = nil
    public var variant: String = "default"
    public var tone: String = "maroon"
    public var size: String = "md"
    public var sampleSize: String? = nil
    public var confidenceInterval: String? = nil
    public var doi: String? = nil
    public var division: String? = nil
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
