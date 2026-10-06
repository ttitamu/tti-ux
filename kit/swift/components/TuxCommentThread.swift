// TuxCommentThread.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCommentThread<Content: View>: View {
    public var modelValue: String
    public var authors: String
    public var currentUser: String
    public var hideResolved: Bool = true
    public var size: String = md
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
