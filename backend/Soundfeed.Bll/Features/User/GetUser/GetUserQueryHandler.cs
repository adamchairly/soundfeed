using MediatR;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Exceptions;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Features;

internal sealed class GetUserQueryHandler(IAppDbContext context, IUserService userService) : IRequestHandler<GetUserQuery, GetUserResponse>
{
    private readonly IAppDbContext _context = context;
    private readonly IUserService _userService = userService;

    public async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userService.FindByIdAsync(request.UserId, cancellationToken)
            ?? throw new EntityNotFoundException($"User with ID '{request.UserId}' was not found.");

        return new GetUserResponse
        {
            RecoveryCode = user.RecoveryCode,
            Email = user.Email,
            EmailNotifications = user.EmailNotifications
        };
    }
}