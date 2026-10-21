// TuxFundingSource.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxFundingSource<Content: View>: View {
    public var funder: String? = nil
    public var abbrev: String? = nil
    public var logo: String? = nil
    public var grant: String? = nil
    public var to: String? = nil
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
