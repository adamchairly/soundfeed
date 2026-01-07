using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Extensions;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class GetReleasesQueryHandler(IAppDbContext context) : IRequestHandler<GetReleasesQuery, PageResult<GetReleaseResponse>>
{
    private readonly IAppDbContext _context = context;

    public async Task<PageResult<GetReleaseResponse>> Handle(GetReleasesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.UserSubscriptions
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
                }));

        query = request.SortDescending
            ? query.OrderByDescending(r => r.ReleaseDate)
            : query.OrderBy(r => r.ReleaseDate);

        return await query.ToPageResultAsync(request.Page, request.PageSize, cancellationToken);
    }
}