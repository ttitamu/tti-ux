// TuxAcknowledgments.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAcknowledgments<Content: View>: View {
    public var funding: String? = nil
    public var acknowledgments: String? = nil
    public var conflicts: String? = nil
    public var ethics: String? = nil
    public var level: Int = 4
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
