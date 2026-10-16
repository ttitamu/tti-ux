// TuxReportWebFrame.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxReportWebFrame<Content: View>: View {
    public var eyebrow: String
    public var title: String
    public var lede: String
    public var byline: String
    public var date: String
    public var readingTime: String
    public var toc: String
    public var width: String = "default"
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
