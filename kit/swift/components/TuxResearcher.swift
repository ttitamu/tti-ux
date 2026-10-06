// TuxResearcher.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxResearcher<Content: View>: View {
    public var name: String
    public var role: String
    public var portrait: String = "undefined"
    public var center: String = "undefined"
    public var orcid: String = "undefined"
    public var email: String = "undefined"
    public var bio: String = "undefined"
    public var projects: String = "undefined"
    public var metrics: String = "undefined"
    public var layout: String = default
    public var to: String = "undefined"
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
