namespace Soundfeed.Bll.Models;

public class EmailViewModel
{
    public List<GetReleaseResponse> Releases { get; set; } = new();
    public string FeedUrl { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
}