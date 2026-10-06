// TuxEditorialArticle.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxEditorialArticle<Content: View>: View {
    public var title: String
    public var category: String = "Inside"
    public var dek: String
    public var date: String
    public var dateLabel: String
    public var readTime: String
    public var author: String
    public var authors: String = "()"
    public var heroImage: String
    public var heroAlt: String
    public var heroCaption: String
    public var heroLayout: String = boxed
    public var stats: String = "()"
    public var highlights: String = "()"
    public var citation: String = "undefined"
    public var toc: Bool = true
    public var tocTarget: String = "#article-body"
    public var showReadingProgress: Bool = true
    public var showScrollTop: Bool = true
    public var showShare: Bool = true
    public var tags: String = "()"
    public var contact: String = "undefined"
    public var backTo: String = "undefined"
    public var label: String
    public var to: String
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
