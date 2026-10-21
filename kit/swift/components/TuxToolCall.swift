// TuxToolCall.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxToolCall<Content: View>: View {
    public var verb: String? = nil
    public var arg: String? = nil
    public var status: String = "completed"
    public var elapsedMs: Int? = nil
    public var diff: String? = nil
    public var icon: String? = nil
    public var defaultOpen: Bool = false
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
