using MediatR;

namespace Soundfeed.Bll.Features;

public class RecoverUserCommand : IRequest<string>
{
    public string RecoveryCode { get; set; } = null!;
}
