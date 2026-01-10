using System.Text.Json.Serialization;

namespace Soundfeed.Bll.Models;

public sealed class GetStatsResponse
{
    [JsonPropertyName("users")]
    public int Users { get; set; }

    [JsonPropertyName("tracks")]
    public int Tracks { get; set; }

    [JsonPropertyName("artists")]
    public int Artists { get; set; }

    [JsonPropertyName("userSubscriptions")]
    public int UserSubscriptions { get; set; }
}
