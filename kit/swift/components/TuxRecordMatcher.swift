// TuxRecordMatcher.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRecordMatcher<Content: View>: View {
    public var items: String? = nil
    public var allowRuleCreation: Bool = true
    public var ruleCheckboxLabel: String = "Remember this mapping rule for future records"
    public var acceptLabel: String = "Confirm Match"
    public var dismissLabel: String = "Defer"
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
