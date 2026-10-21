// TuxSignupFeature.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSignupFeature<Content: View>: View {
    public var title: String? = nil
    public var eyebrow: String? = nil
    public var dek: String? = nil
    public var actionLabel: String = "Subscribe"
    public var placeholder: String = "your@email.edu"
    public var consent: String = "We never share your address. Unsubscribe in one click."
    public var modelValue: String = ""
    public var tone: String = "neutral"
    public var variant: String = "default"
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
