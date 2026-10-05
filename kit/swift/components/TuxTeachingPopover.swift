// TuxTeachingPopover.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxTeachingPopover<Content: View>: View {
    public var modelValue: Bool = false
    public var step: Int = 1
    public var totalSteps: Int = 1
    public var title: String = "undefined"
    public var onBrand: Bool = false
    public var noDismiss: Bool = false
    public var primaryLabel: String = "undefined"
    public var secondaryLabel: String = "Skip"
    public var noSecondary: Bool = false
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
