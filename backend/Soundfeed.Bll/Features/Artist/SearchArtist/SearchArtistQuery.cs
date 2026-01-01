using MediatR;

namespace Soundfeed.Bll.Features;

public sealed class SearchArtistQuery : IRequest<IReadOnlyList<SearchArtistResponse>>
{
    public required string Query { get; init; }
}

