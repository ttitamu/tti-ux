// TuxContactCard.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxContactCard<Content: View>: View {
    public var name: String
    public var role: String
    public var affiliation: String
    public var credentials: String
    public var image: String
    public var initial: String
    public var tone: String = "maroon"
    public var contacts: String
    public var layout: String = "vertical"
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
