// TuxEventCalendarRow.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxEventCalendarRow<Content: View>: View {
    public var day: String? = nil
    public var month: String? = nil
    public var title: String? = nil
    public var time: String = ""
    public var location: String = ""
    public var category: String = ""
    public var to: String = ""
    public var href: String = ""
    public var actionText: String = "View Event"
    public var chipTone: String = "green"
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
