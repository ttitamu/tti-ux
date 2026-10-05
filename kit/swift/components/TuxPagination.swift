// TuxPagination.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxPagination<Content: View>: View {
    public var total: Int
    public var modelValue: Int
    public var pageSize: Int = 20
    public var siblingCount: Int = 1
    public var boundaryCount: Int = 1
    public var showStatus: Bool = false
    public var noun: String = "result"
    public var pluralNoun: String = "undefined"
    public var ariaLabel: String = "Pagination"
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
