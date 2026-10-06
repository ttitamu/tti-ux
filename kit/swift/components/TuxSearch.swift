// TuxSearch.swift — SwiftUI View Component.
// Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).

import SwiftUI

public struct TuxSearch<Content: View>: View {
    public var modelValue: String
    public var variant: String = "field"
    public var blockBar: String = "field"
    public var size: String = regular
    public var placeholder: String = "Search"
    public var heading: String = "undefined"
    public var lede: String = "undefined"
    public var ariaLabel: String = "undefined"
    public var actionLabel: String = "Search"
    public var actionIcon: String = "undefined"
    public var leadingIcon: String = lucide:search
    public var clearable: Bool = true
    public var loading: Bool = false
    public var disabled: Bool = false
    public var cornerDrop: Bool = false
    public var forceFocus: Bool = false
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
