// TuxEditorialArticle.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxEditorialArticle<Content: View>: View {
    public var title: String? = nil
    public var category: String = "Inside Lane"
    public var dek: String = ""
    public var date: String = ""
    public var dateLabel: String = ""
    public var readTime: String = ""
    public var author: String = ""
    public var authors: String? = nil
    public var heroImage: String = ""
    public var heroAlt: String = ""
    public var heroCaption: String = ""
    public var heroLayout: String = "boxed"
    public var stats: String? = nil
    public var highlights: String? = nil
    public var citation: String? = nil
    public var toc: Bool = true
    public var tocTarget: String = "#article-body"
    public var showReadingProgress: Bool = true
    public var showScrollTop: Bool = true
    public var showShare: Bool = true
    public var tags: String? = nil
    public var contact: String? = nil
    public var backTo: String? = nil
    public var label: String? = nil
    public var to: String? = nil
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
