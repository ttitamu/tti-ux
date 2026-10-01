<script setup lang="ts">
useHead({ title: "Install .NET & C# · TUX" });

const nugetCmd = "dotnet add package Tti.Tux.AspNetCore --source https://code.tti.tamu.edu/api/packages/tti/nuget/index.json";
const blazorCmd = "dotnet add package Tti.Tux.Blazor --source https://code.tti.tamu.edu/api/packages/tti/nuget/index.json";

const razorSnippet = `@addTagHelper *, Tti.Tux.AspNetCore

<tux-page-header eyebrow="Research Center" title="Connected Infrastructure">
    <tux-button intent="Primary" asp-action="Export">Export Data</tux-button>
</tux-page-header>

<div class="row">
    <div class="col-md-4">
        <tux-card>
            <tux-big-stat value="93.4" suffix="%" label="Classifier Precision" tone="maroon" />
        </tux-card>
    </div>
</div>`;

const blazorSnippet = `@using Tti.Tux.Blazor

<TuxCard To="/reports" Padded="true">
    <TuxBigStat Value="126" Suffix="M" Label="Annual research expenditure" Tone="maroon" />
</TuxCard>`;

const csharpTokenSnippet = `using Tti.Tux;

// Direct literal access in C# code, reports, or WPF/MAUI:
string maroonHex = TuxTokens.Tti.BrandPrimary; // "#500000"
string goldHex = TuxTokens.Tti.BrandAccent;   // "#C59B27"`;
</script>

<template>
  <div class="space-y-8">
    <TuxBreadcrumbs :trail="[{ label: 'Home', to: '/' }, { label: 'Install', to: '/install' }, { label: '.NET / C#' }]" />

    <TuxPageHeader eyebrow="Target · C# / .NET" title="Using TUX in .NET & ASP.NET">
      Consume TUX tokens, Tag Helpers, and Blazor components in .NET 8/9 and legacy ASP.NET MVC applications.
    </TuxPageHeader>

    <section class="space-y-3">
      <TuxSectionHeader title="1. ASP.NET Core Razor Pages & MVC" />
      <p class="text-sm text-text-secondary">
        Install the Razor Tag Helper package from Forgejo NuGet:
      </p>
      <TuxCodeBlock :code="nugetCmd" language="sh" filename="terminal" />
      <p class="text-sm text-text-secondary mt-2">
        Add <code>@addTagHelper *, Tti.Tux.AspNetCore</code> to your <code>_ViewImports.cshtml</code> and author views with native tags:
      </p>
      <TuxCodeBlock :code="razorSnippet" language="html" filename="Index.cshtml" />
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="2. Blazor (Server & WebAssembly)" />
      <p class="text-sm text-text-secondary">
        Install the Blazor Razor Class Library (RCL):
      </p>
      <TuxCodeBlock :code="blazorCmd" language="sh" filename="terminal" />
      <p class="text-sm text-text-secondary mt-2">
        Use typed Blazor components in <code>.razor</code> pages:
      </p>
      <TuxCodeBlock :code="blazorSnippet" language="html" filename="Dashboard.razor" />
    </section>

    <section class="space-y-3">
      <TuxSectionHeader title="3. C# Design Token Constants" />
      <p class="text-sm text-text-secondary">
        For WPF, MAUI, PDF generators, or background services without HTML, consume <code>TuxTokens.cs</code>:
      </p>
      <TuxCodeBlock :code="csharpTokenSnippet" language="csharp" filename="ReportGenerator.cs" />
    </section>
  </div>
</template>
