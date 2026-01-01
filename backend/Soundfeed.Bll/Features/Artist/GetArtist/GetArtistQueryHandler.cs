using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Exceptions;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class GetArtistQueryHandler(IAppDbContext context) : IRequestHandler<GetArtistQuery, GetArtistResponse>
{
    private readonly IAppDbContext _context = context;

    public async Task<GetArtistResponse> Handle(GetArtistQuery request, CancellationToken cancellationToken)
    {
        return await _context.Artists
            .Where(a => a.Id == request.Id)
            .Select(a => new GetArtistResponse
            {
                Id = a.Id,
                Name = a.Name,
                SpotifyId = a.SpotifyArtistId,
                SpotifyUrl = a.SpotifyUrl,
                ImageUrl = a.SpotifyImageUrl
            })
            .FirstOrDefaultAsync(cancellationToken)
                ?? throw new EntityNotFoundException($"Failed to get the artist with the id: {request.Id}");
    }
}
