// TuxRecordDiff.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRecordDiff<Content: View>: View {
    public var fields: String? = nil
    public var beforeLabel: String = "Baseline"
    public var afterLabel: String = "Current"
    public var changesOnlyDefault: Bool = false
    public var title: String? = nil
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
