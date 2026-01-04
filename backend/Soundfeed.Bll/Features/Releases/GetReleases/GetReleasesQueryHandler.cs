using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class GetReleasesQueryHandler(IAppDbContext context) : IRequestHandler<GetReleasesQuery, IReadOnlyList<GetReleaseResponse>>
{
    private readonly IAppDbContext _context = context;

    public async Task<IReadOnlyList<GetReleaseResponse>> Handle(GetReleasesQuery request, CancellationToken cancellationToken)
    {
        return await _context.UserSubscriptions
            .AsNoTracking()
            .Where(s => s.UserId == request.UserId)
            .SelectMany(s => s.Artist.Releases
                .Where(r => r.ReleaseDate > s.CreatedAt && !r.DismissedBy.Any(u => u.Id == request.UserId))
                .Select(r => new GetReleaseResponse
                {
                    Id = r.Id,
                    Title = r.Title,
                    ArtistName = s.Artist.Name,
                    ReleaseDate = r.ReleaseDate,
                    CoverUrl = r.CoverUrl,
                    SpotifyUrl = r.SpotifyReleaseUrl,
                    Label = r.Label,
                    ReleaseType = r.ReleaseType,
                    Tracks = r.Tracks
                        .OrderBy(t => t.TrackNumber)
                        .Select(t => new TrackResponse
                        {
                            Title = t.Title,
                            TrackNumber = t.TrackNumber
                        }).ToList()
                }))
            .OrderByDescending(r => r.ReleaseDate)
            .ToListAsync(cancellationToken);
    }
}