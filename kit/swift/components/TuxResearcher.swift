// TuxResearcher.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxResearcher<Content: View>: View {
    public var name: String
    public var role: String
    public var portrait: String
    public var center: String
    public var orcid: String
    public var email: String
    public var bio: String
    public var projects: String
    public var metrics: String
    public var layout: String = "default"
    public var to: String
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
