using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Exceptions;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class UpdateEmailSettingsCommandHandler(IAppDbContext context) : IRequestHandler<UpdateEmailSettingsCommand>
{
    private readonly IAppDbContext _context = context;

    public async Task Handle(UpdateEmailSettingsCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken)
            ?? throw new EntityNotFoundException($"User with ID '{request.UserId}' was not found.");

        if (request.Email != null)
        {
            user.Email = request.Email;
        }

        if (request.Enabled.HasValue)
        {
            user.EmailNotifications = request.Enabled.Value;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}