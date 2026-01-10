namespace Soundfeed.Bll.Models.Dtos;

public sealed class StatsDto
{
    public int Users { get; set; }
    public int Tracks { get; set; }
    public int Artists { get; set; }
    public int UserSubscriptions { get; set; }

    public GetStatsResponse ToResponse()
        => new()
        {
            Users = Users,
            Tracks = Tracks,
            Artists = Artists,
            UserSubscriptions = UserSubscriptions
        };
}