using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Tti.Tux.AspNetCore.TagHelpers;

/// <summary>
/// Tag helper for TuxCard — TTI-flavored card.
/// Usage:
///   &lt;tux-card to="/reports" padded="true"&gt;
///       &lt;h3&gt;Report Title&lt;/h3&gt;
///   &lt;/tux-card&gt;
/// </summary>
[HtmlTargetElement("tux-card")]
public class TuxCardTagHelper : TagHelper
{
    public string? To { get; set; }
    public bool Padded { get; set; } = true;
    public bool Linked { get; set; } = false;

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var isLink = !string.IsNullOrEmpty(To);
        output.TagName = isLink ? "a" : "div";

        var baseClass = isLink || Linked ? "card-linked" : "card-static";
        var paddingClass = Padded ? "p-6" : "";
        output.Attributes.SetAttribute("class", $"{baseClass} {paddingClass}".Trim());

        if (isLink)
        {
            output.Attributes.SetAttribute("href", To);
        }

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent.GetContent());
    }
}
