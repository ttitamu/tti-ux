// TuxVizRPlot.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxVizRPlot<Content: View>: View {
    public var src: String
    public var kind: String = "image"
    public var title: String
    public var eyebrow: String
    public var ratio: String = "16/10"
    public var alt: String
    public var src2x: String
    public var source: String
    public var level: Int = 3
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
