// TuxResultCount.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxResultCount<Content: View>: View {
    public var page: Int? = nil
    public var pageSize: Int? = nil
    public var total: Int? = nil
    public var noun: String? = nil
    public var nounPlural: String? = nil
    public var pageSizeOptions: String? = nil
    public var hideRange: Bool = false
    public var pageSizeLabel: String = "per page"
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
