// TuxBreadcrumbs.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxBreadcrumbs<Content: View>: View {
    public var trail: String
    public var homeIcon: Bool = true
    public var chevron: Bool = false
    public var ariaLabel: String = "Breadcrumb"
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
