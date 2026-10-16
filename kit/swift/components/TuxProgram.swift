// TuxProgram.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxProgram<Content: View>: View {
    public var name: String
    public var eyebrow: String
    public var summary: String
    public var hero: String
    public var leads: String
    public var funders: String
    public var metrics: String
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
