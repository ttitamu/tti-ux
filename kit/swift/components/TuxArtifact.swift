// TuxArtifact.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxArtifact<Content: View>: View {
    public var title: String
    public var meta: String = "undefined"
    public var icon: String = "lucide:file-code"
    public var actions: String = "()"
    public var busy: Bool = false
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
