// TuxResearcher.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxResearcher<Content: View>: View {
    public var name: String? = nil
    public var role: String? = nil
    public var portrait: String? = nil
    public var center: String? = nil
    public var orcid: String? = nil
    public var email: String? = nil
    public var bio: String? = nil
    public var projects: String? = nil
    public var metrics: String? = nil
    public var layout: String = "default"
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
