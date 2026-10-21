// TuxLab.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxLab<Content: View>: View {
    public var name: String? = nil
    public var summary: String? = nil
    public var logo: String? = nil
    public var projectsCount: Int? = nil
    public var peopleCount: Int? = nil
    public var location: String? = nil
    public var leaders: String? = nil
    public var focus: String? = nil
    public var to: String? = nil
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
