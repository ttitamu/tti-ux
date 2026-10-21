// TuxEmptyState.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxEmptyState<Content: View>: View {
    public var kind: String? = nil
    public var icon: String? = nil
    public var title: String? = nil
    public var description: String? = nil
    public var noCard: Bool = false
    public var compact: Bool = false
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
