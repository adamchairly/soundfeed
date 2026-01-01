using MediatR;
using Soundfeed.Bll.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class SearchArtistQueryHandler(ISpotifyService spotifyService) : IRequestHandler<SearchArtistQuery, IReadOnlyList<SearchArtistResponse>>
{
    private readonly ISpotifyService _spotifyService = spotifyService;

    public async Task<IReadOnlyList<SearchArtistResponse>> Handle(SearchArtistQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
            return [];

        var artist = await _spotifyService.SearchArtistsAsync(request.Query, cancellationToken);

        return artist.Select(a => new SearchArtistResponse
        {
            SpotifyUrl = a.SpotifyUrl,
            Name = a.Name,
            ImageUrl = a.ImageUrl
        }).ToList();
    }
}

