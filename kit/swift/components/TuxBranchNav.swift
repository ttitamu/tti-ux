// TuxBranchNav.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBranchNav<Content: View>: View {
    public var modelValue: Int
    public var total: Int
    public var loop: Bool = false
    public var hideSingleton: Bool = true
    public var ariaLabel: String = "Response"
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
