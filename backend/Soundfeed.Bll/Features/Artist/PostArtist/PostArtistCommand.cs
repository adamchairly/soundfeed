using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class PostArtistCommand : IRequest<int>
{
    public required string ArtistUrl { get; init; }

    public required string UserId { get; init; }
}
