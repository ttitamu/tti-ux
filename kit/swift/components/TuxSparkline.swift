// TuxSparkline.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSparkline<Content: View>: View {
    public var data: String
    public var width: Int = 120
    public var height: Int = 32
    public var tone: String = "brand"
    public var strokeWidth: Int = 1.5
    public var showArea: Bool = false
    public var showLastPoint: Bool = true
    public var showDelta: Bool = false
    public var deltaFormat: String = percent
    public var ariaSummary: String = "undefined"
    public var units: String = "undefined"
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
