// TuxPaperMeta.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPaperMeta<Content: View>: View {
    public var doi: String
    public var license: String
    public var funders: String
    public var published: String
    public var version: String
    public var type: String
    public var pages: String
    public var venue: String
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
