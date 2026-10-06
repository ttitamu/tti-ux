// TuxRichDataGrid.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRichDataGrid<Content: View>: View {
    public var columns: String
    public var rows: String
    public var rowKey: String = "id"
    public var title: String = "undefined"
    public var meta: String = "undefined"
    public var searchPlaceholder: String = "Search…"
    public var showSearch: Bool = true
    public var showFilter: Bool = true
    public var showColumns: Bool = true
    public var showExport: Bool = true
    public var filters: String = "()"
    public var selected: String = ()
    public var selectionDisabled: Bool = false
    public var bulkActions: String = "()"
    public var expanded: String = ()
    public var expansionDisabled: Bool = false
    public var sortKey: String = "undefined"
    public var sortDir: String = undefined
    public var maxHeight: String = "440px"
    public var virtualized: Bool = false
    public var virtualRowHeight: Int = 44
    public var density: String = comfortable
    public var paginationLabel: String
    public var paginationTokens: String = "()"
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
