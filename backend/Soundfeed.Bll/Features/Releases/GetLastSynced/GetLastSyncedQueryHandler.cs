using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class GetLastSyncedQueryHandler(IAppDbContext context) : IRequestHandler<GetLastSyncedQuery, DateTime?>
{
    private readonly IAppDbContext _context = context;

    public async Task<DateTime?> Handle(GetLastSyncedQuery request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == request.UserId)
            .Select(u => u.LastSyncedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }
}