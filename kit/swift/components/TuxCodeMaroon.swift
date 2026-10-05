// TuxCodeMaroon.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxCodeMaroon<Content: View>: View {
    public var active: Bool = false
    public var tone: String = error
    public var title: String = "Emergency"
    public var message: String = "undefined"
    public var detailsUrl: String = "https://tti.tamu.edu/emergency/"
    public var detailsLabel: String = "View"
    public var dismissible: Bool = false
    public var modelValue: Bool = false
    public var sticky: Bool = false
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
