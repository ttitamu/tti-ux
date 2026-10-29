// TuxSignoffChain.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSignoffChain<Content: View>: View {
    public var stages: String? = nil
    public var activeStageId: String? = nil
    public var attestationText: String? = nil
    public var decisionOptions: String? = nil
    public var decisionLabel: String = "Continuation Decision"
    public var modelValue: String? = nil
    public var showActions: Bool = true
    public var approveLabel: String = "Approve & Sign Off"
    public var rejectLabel: String = "Return for Revision"
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
