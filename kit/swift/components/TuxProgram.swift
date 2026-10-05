// TuxProgram.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxProgram<Content: View>: View {
    public var name: String
    public var eyebrow: String = "undefined"
    public var summary: String = "undefined"
    public var hero: String = "undefined"
    public var leads: String = "undefined"
    public var funders: String = "undefined"
    public var metrics: String = "undefined"
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
