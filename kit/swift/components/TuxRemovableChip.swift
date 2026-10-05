// TuxRemovableChip.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxRemovableChip<Content: View>: View {
    public var icon: String = "undefined"
    public var removable: Bool = false
    public var size: String = md
    public var selected: Bool = false
    public var disabled: Bool = false
    public var removeLabel: String = "undefined"
    public var clickToRemove: Bool = false
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
