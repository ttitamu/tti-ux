// TuxUnitValue.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxUnitValue<Content: View>: View {
    public var value: Int? = nil
    public var unit: String? = nil
    public var ci: Int? = nil
    public var decimals: Int? = nil
    public var label: String = ""
    public var station: String = ""
    public var variant: String = "inline"
    public var interactive: Bool = false
    public var system: String? = nil
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
