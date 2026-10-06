// TuxSiteNav.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSiteNav<Content: View>: View {
    public var identity: String
    public var primaryNav: String = "()"
    public var utilityNav: String = "()"
    public var search: Bool = false
    public var sticky: Bool = false
    public var ariaLabel: String = "Primary"
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
