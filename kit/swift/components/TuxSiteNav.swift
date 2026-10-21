// TuxSiteNav.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSiteNav<Content: View>: View {
    public var identity: String? = nil
    public var primaryNav: String? = nil
    public var utilityNav: String? = nil
    public var search: Bool = false
    public var sticky: Bool = false
    public var ariaLabel: String = "Primary navigation"
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
