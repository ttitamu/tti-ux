// TuxContactCard.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxContactCard<Content: View>: View {
    public var name: String
    public var role: String = "undefined"
    public var affiliation: String = "undefined"
    public var credentials: String = "undefined"
    public var image: String = "undefined"
    public var initial: String = "undefined"
    public var tone: String = maroon
    public var contacts: String = "()"
    public var layout: String = vertical
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
