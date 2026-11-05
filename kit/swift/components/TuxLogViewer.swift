// TuxLogViewer.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxLogViewer<Content: View>: View {
    public var title: String = "Operational Job & Telemetry Logs"
    public var lines: String? = nil
    public var initialLevel: String = "all"
    public var wrapLines: Bool = true
    public var showLineNumbers: Bool = true
    public var maxHeight: String = "24rem"
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
