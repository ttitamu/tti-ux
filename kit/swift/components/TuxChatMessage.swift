// TuxChatMessage.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxChatMessage<Content: View>: View {
    public var role: String = "user"
    public var author: String? = nil
    public var timestamp: String? = nil
    public var meta: String? = nil
    public var initials: String? = nil
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
