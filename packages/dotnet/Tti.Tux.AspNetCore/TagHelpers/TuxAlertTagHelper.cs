using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Tti.Tux.AspNetCore.TagHelpers;

/// <summary>
/// Tag helper for TuxAlert — Docusaurus-style admonitions.
/// Usage:
///   &lt;tux-alert variant="warning" title="Maintenance Notice"&gt;
///       The server will restart at midnight.
///   &lt;/tux-alert&gt;
/// </summary>
[HtmlTargetElement("tux-alert")]
public class TuxAlertTagHelper : TagHelper
{
    public string Variant { get; set; } = "info";
    public string? Title { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "aside";
        output.Attributes.SetAttribute("class", $"tux-alert tux-alert--{Variant}");
        output.Attributes.SetAttribute("role", Variant is "warning" or "error" or "danger" ? "alert" : "status");

        var titleHtml = !string.IsNullOrEmpty(Title)
            ? $"<h4 class=\"tux-alert__title\">{HtmlEncoder.Default.Encode(Title)}</h4>"
            : "";

        var childContent = await output.GetChildContentAsync();

        output.Content.SetHtmlContent($@"
            {titleHtml}
            <div class=""tux-alert__body"">{childContent.GetContent()}</div>
        ");
    }
}
