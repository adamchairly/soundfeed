using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class DeleteSubscriptionCommand : IRequest
{
    public required int ArtistId { get; init; }
    public required string UserId { get; init; }
}