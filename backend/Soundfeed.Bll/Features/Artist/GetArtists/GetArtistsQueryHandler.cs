using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal class GetArtistsQueryHandler(IAppDbContext context) : IRequestHandler<GetArtistsQuery, IReadOnlyList<GetArtistResponse>>
{
    private readonly IAppDbContext _context = context;

    public async Task<IReadOnlyList<GetArtistResponse>> Handle(GetArtistsQuery request, CancellationToken cancellationToken)
    {
        return await _context.UserSubscriptions
            .Include(x => x.Artist)
            .Where(x => x.UserId == request.UserId)
            .Select(x => new GetArtistResponse
            {
                Id = x.ArtistId,
                Name = x.Artist.Name,
                SpotifyId = x.Artist.SpotifyArtistId,
                SpotifyUrl = x.Artist.SpotifyUrl,
                ImageUrl = x.Artist.SpotifyImageUrl
            })
            .ToListAsync(cancellationToken);
    }
}