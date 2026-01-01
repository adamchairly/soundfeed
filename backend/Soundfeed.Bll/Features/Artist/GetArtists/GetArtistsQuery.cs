using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class GetArtistsQuery : IRequest<IReadOnlyList<GetArtistResponse>>
{
    public required string UserId { get; init; }
}
