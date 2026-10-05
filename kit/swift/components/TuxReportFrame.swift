// TuxReportFrame.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxReportFrame<Content: View>: View {
    public var size: String = "letter"
    public var density: String = "editorial"
    public var breakAfter: Bool = false
    public var title: String = "undefined"
    public var eyebrow: String = "undefined"
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
