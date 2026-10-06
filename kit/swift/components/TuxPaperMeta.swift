// TuxPaperMeta.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPaperMeta<Content: View>: View {
    public var doi: String = "undefined"
    public var license: String = "undefined"
    public var funders: String = "undefined"
    public var published: String = "undefined"
    public var version: String = "undefined"
    public var type: String = "undefined"
    public var pages: String = "undefined"
    public var venue: String = "undefined"
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
