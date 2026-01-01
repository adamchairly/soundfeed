using MediatR;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Exceptions;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class RecoverUserCommandHandler(IAppDbContext context) : IRequestHandler<RecoverUserCommand, string>
{
    private readonly IAppDbContext _context = context;
    public async Task<string> Handle(RecoverUserCommand request, CancellationToken cancellationToken)
    {
        var normalizedCode = request.RecoveryCode.Trim().ToUpper();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RecoveryCode == normalizedCode, cancellationToken);

        if (user is null)
        {
            throw new EntityNotFoundException($"Invalid recovery code: {request.RecoveryCode}");
        }

        user.LastSeenAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}
