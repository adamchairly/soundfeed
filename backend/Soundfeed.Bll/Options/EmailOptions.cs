namespace Soundfeed.Bll.Options;

public class EmailOptions
{
    public const string SectionName = "Email";

    public string ApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string? FromName { get; set; }
    public string FeedUrl { get; set; } = "";
    public string LogoUrl { get; set; } = "";
}

