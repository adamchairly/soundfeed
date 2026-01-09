using MediatR;

namespace Soundfeed.Bll.Features;

public sealed class UpdateEmailSettingsCommand : IRequest
{
    public string? UserId { get; init; }
    public string? Email { get; init; }
    public bool? Enabled { get; init; }
}