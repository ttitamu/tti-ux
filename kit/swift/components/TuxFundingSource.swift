// TuxFundingSource.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFundingSource<Content: View>: View {
    public var funder: String
    public var abbrev: String
    public var logo: String
    public var grant: String
    public var to: String
    public var size: String = "md"
    public var layout: String = "inline"
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
