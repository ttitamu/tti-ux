// TuxContactCard.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxContactCard<Content: View>: View {
    public var name: String? = nil
    public var role: String? = nil
    public var affiliation: String? = nil
    public var credentials: String? = nil
    public var image: String? = nil
    public var initial: String? = nil
    public var tone: String = "maroon"
    public var contacts: String? = nil
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
