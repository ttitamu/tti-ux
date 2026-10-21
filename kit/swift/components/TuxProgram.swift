// TuxProgram.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxProgram<Content: View>: View {
    public var name: String? = nil
    public var eyebrow: String? = nil
    public var summary: String? = nil
    public var hero: String? = nil
    public var leads: String? = nil
    public var funders: String? = nil
    public var metrics: String? = nil
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
