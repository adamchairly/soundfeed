using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Features;

internal sealed class PostArtistCommandHandler(ISpotifyService spotifyService, IAppDbContext context) : IRequestHandler<PostArtistCommand, int>
{
    private readonly ISpotifyService _spotifyService = spotifyService;

    private readonly IAppDbContext _context = context;

    public async Task<int> Handle(PostArtistCommand request, CancellationToken cancellationToken)
    {
        var spotifyId = ExtractArtistIdFromUrl(request.ArtistUrl);

        var artist = await _context.Artists
            .FirstOrDefaultAsync(x => x.SpotifyArtistId == spotifyId, cancellationToken);

        if (artist is null)
        {
            var spotifyData = await _spotifyService.GetArtistAsync(spotifyId, cancellationToken)
                ?? throw new ArgumentException("Artist not found on Spotify.", nameof(request.ArtistUrl));

            artist = new Artist
            {
                Name = spotifyData.Name,
                SpotifyArtistId = spotifyId,
                SpotifyUrl = request.ArtistUrl,
                SpotifyImageUrl = spotifyData.ImageUrl ?? "",
                CreatedAt = DateTime.UtcNow
            };

            _context.Artists.Add(artist);
        }

        var isSubscribed = await _context.UserSubscriptions
            .AnyAsync(s => s.UserId == request.UserId && s.ArtistId == artist.Id, cancellationToken);

        if (!isSubscribed)
        {
            _context.UserSubscriptions.Add(new UserSubscription
            {
                UserId = request.UserId,
                Artist = artist,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        return artist.Id;
    }

    private string ExtractArtistIdFromUrl(string artistUrl)
    {
        var uri = new Uri(artistUrl);
        var segments = uri.Segments;

        if (segments.Length < 3 || !segments[1].TrimEnd('/').Equals("artist", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Invalid Spotify artist URL.", nameof(artistUrl));
        }

        return segments[2].TrimEnd('/');
    }
}
