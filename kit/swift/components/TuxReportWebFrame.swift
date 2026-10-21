// TuxReportWebFrame.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxReportWebFrame<Content: View>: View {
    public var eyebrow: String? = nil
    public var title: String? = nil
    public var lede: String? = nil
    public var byline: String? = nil
    public var date: String? = nil
    public var readingTime: String? = nil
    public var toc: String? = nil
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
