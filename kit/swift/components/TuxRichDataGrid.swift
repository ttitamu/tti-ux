// TuxRichDataGrid.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRichDataGrid<Content: View>: View {
    public var columns: String? = nil
    public var rows: String? = nil
    public var rowKey: String = "id"
    public var title: String? = nil
    public var meta: String? = nil
    public var searchPlaceholder: String = "Search…"
    public var showSearch: Bool = true
    public var showFilter: Bool = true
    public var showColumns: Bool = true
    public var showExport: Bool = true
    public var filters: String? = nil
    public var selected: String? = nil
    public var selectionDisabled: Bool = false
    public var bulkActions: String? = nil
    public var expanded: String? = nil
    public var expansionDisabled: Bool = false
    public var sortKey: String? = nil
    public var sortDir: String? = nil
    public var maxHeight: String = "440px"
    public var virtualized: Bool = false
    public var virtualRowHeight: Int = 44
    public var density: String = "comfortable"
    public var paginationLabel: String = ""
    public var paginationTokens: String? = nil
    public var projectNumber: String? = nil
    public var doi: String? = nil
    public var citation: String? = nil
    public var showUnitToggle: Bool = false
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
