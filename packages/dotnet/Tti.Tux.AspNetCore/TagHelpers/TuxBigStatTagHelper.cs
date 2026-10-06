using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Tti.Tux.AspNetCore.TagHelpers;

/// <summary>
/// Tag helper for TuxBigStat — the institutional headline metric.
/// Usage:
///   &lt;tux-big-stat value="126" suffix="M" label="Annual research expenditure" tone="Maroon" /&gt;
/// </summary>
[HtmlTargetElement("tux-big-stat")]
public class TuxBigStatTagHelper : TagHelper
{
    public string Value { get; set; } = string.Empty;
    public string? Suffix { get; set; }
    public string Label { get; set; } = string.Empty;
    public string? Source { get; set; }
    public string Variant { get; set; } = "default";
    public string Tone { get; set; } = "maroon";
    public string Size { get; set; } = "md";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("class", $"tux-big-stat tux-big-stat--{Tone} tux-big-stat--{Variant} tux-big-stat--{Size}");

        var suffixHtml = !string.IsNullOrEmpty(Suffix)
            ? $"<span class=\"tux-big-stat__suffix\">{HtmlEncoder.Default.Encode(Suffix)}</span>"
            : "";

        var sourceHtml = !string.IsNullOrEmpty(Source)
            ? $"<p class=\"tux-big-stat__source\">{HtmlEncoder.Default.Encode(Source)}</p>"
            : "";

        output.Content.SetHtmlContent($@"
            <div class=""tux-big-stat__numeral"">
                <span class=""tux-big-stat__value"">{HtmlEncoder.Default.Encode(Value)}</span>{suffixHtml}
            </div>
            <p class=""tux-big-stat__label"">{HtmlEncoder.Default.Encode(Label)}</p>
            {sourceHtml}
        ");
    }
}
