using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Abstractions;

public interface ISpotifyService
{
    /// <summary>
    /// Gets an aritist's information from Spotify, based on artist identifier.
    /// </summary>
    /// <param name="artistId">The artist identifier.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns></returns>
    Task<ArtistDto> GetArtistAsync(string artistId, CancellationToken cancellationToken);

    /// <summary>
    /// Gets new releases for an artist, based on artist identifier, excluding releases that are already known.
    /// </summary>
    /// <param name="artistId">The artist identifier.</param>
    /// <param name="knownSpotifyIds">The known spotify ids.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns></returns>
    Task<IReadOnlyList<ReleaseDto>> GetReleasesForArtistAsync(string artistId, IReadOnlySet<string> knownSpotifyIds, CancellationToken cancellationToken);

    /// <summary>
    /// Searches an artist on Spotify by name and returns a list of matching artists, ordered by relevance.
    /// </summary>
    /// <param name="query">The query.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns></returns>
    Task<IReadOnlyList<ArtistDto>> SearchArtistsAsync(string query, int offset, CancellationToken cancellationToken);
}
