using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Abstractions;

public interface ISpotifyService
{
    Task<ArtistDto> GetArtistAsync(string artistId, CancellationToken cancellationToken);
    Task<IReadOnlyList<ReleaseDto>> GetReleasesForArtistAsync(string artistId, CancellationToken cancellationToken);
    Task<IReadOnlyList<ArtistDto>> SearchArtistsAsync(string query, CancellationToken cancellationToken);
}
