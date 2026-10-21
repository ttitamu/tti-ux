// TuxAbstract.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxAbstract<Content: View>: View {
    public var background: String? = nil
    public var methods: String? = nil
    public var results: String? = nil
    public var conclusion: String? = nil
    public var keywords: String? = nil
    public var variant: String = "structured"
    public var level: Int = 4
    public var plainSummary: String? = nil
    public var policyTakeaways: String? = nil
    public var doi: String? = nil
    public var projectNumber: String? = nil
    public var citation: String? = nil
    public var division: String? = nil
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
