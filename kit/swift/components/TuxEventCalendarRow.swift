// TuxEventCalendarRow.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxEventCalendarRow<Content: View>: View {
    public var day: String
    public var month: String
    public var title: String
    public var time: String
    public var location: String
    public var category: String
    public var to: String
    public var href: String
    public var actionText: String = "View"
    public var chipTone: String = green
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
