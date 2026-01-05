using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class DeleteSubscriptionCommandHandler(IAppDbContext context) : IRequestHandler<DeleteSubscriptionCommand>
{
    private readonly IAppDbContext _context = context;

    public async Task Handle(DeleteSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscription = await _context.UserSubscriptions
            .FirstOrDefaultAsync(
                s => s.UserId == request.UserId && s.ArtistId == request.ArtistId,
                cancellationToken);

        if (subscription != null)
        {
            _context.UserSubscriptions.Remove(subscription);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}