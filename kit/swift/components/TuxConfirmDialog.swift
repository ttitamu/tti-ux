// TuxConfirmDialog.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxConfirmDialog<Content: View>: View {
    public var open: Bool = false
    public var title: String
    public var eyebrow: String = "undefined"
    public var confirmLabel: String = "undefined"
    public var cancelLabel: String = "Cancel"
    public var variant: String = destructive
    public var confirmDisabled: Bool = false
    public var loading: Bool = false
    public var size: String = sm
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
