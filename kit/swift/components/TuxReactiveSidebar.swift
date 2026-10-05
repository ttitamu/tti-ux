// TuxReactiveSidebar.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxReactiveSidebar<Content: View>: View {
    public var sections: String
    public var allSections: String = "undefined"
    public var collapsed: Bool = false
    public var activeAreaTitle: String = "Workspace"
    public var activeAreaIcon: String = "lucide:layers"
    public var search: Bool = true
    public var searchPlaceholder: String = "Filter"
    public var showAll: Bool = false
    public var defaultExpanded: Bool = false
    public var exclusive: Bool = false
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
