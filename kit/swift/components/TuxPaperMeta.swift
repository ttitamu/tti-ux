// TuxPaperMeta.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPaperMeta<Content: View>: View {
    public var doi: String? = nil
    public var license: String? = nil
    public var funders: String? = nil
    public var published: String? = nil
    public var version: String? = nil
    public var type: String? = nil
    public var pages: String? = nil
    public var venue: String? = nil
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
