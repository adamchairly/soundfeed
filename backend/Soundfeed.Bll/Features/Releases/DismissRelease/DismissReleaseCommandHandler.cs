using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class DismissReleaseCommandHandler(IAppDbContext context) : IRequestHandler<DismissReleaseCommand>
{
    private readonly IAppDbContext _context = context;

    public async Task Handle(DismissReleaseCommand request, CancellationToken cancellationToken)
    {
        var release = await _context.Releases
            .Include(r => r.DismissedBy)
            .FirstOrDefaultAsync(r => r.Id == request.ReleaseId, cancellationToken);

        if (release == null)
            return;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null)
            return;

        if (!release.DismissedBy.Contains(user))
        {
            release.DismissedBy.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}