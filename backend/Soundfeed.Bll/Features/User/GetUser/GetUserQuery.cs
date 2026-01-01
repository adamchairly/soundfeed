using MediatR;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Features;

public sealed class GetUserQuery : IRequest<GetUserResponse>
{
    public required string UserId { get; init; }
}
