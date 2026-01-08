using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Abstractions;

public interface IEmailService
{
    Task SendReleaseDigestAsync(string email, string userName, List<GetReleaseResponse> releases, CancellationToken cancellationToken);
}

