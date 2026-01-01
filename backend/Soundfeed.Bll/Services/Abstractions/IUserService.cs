using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Abstractions;

public interface IUserService
{
    Task<User?> FindByIdAsync(string id, CancellationToken cancellationToken);
    Task CreateAsync(User user, CancellationToken cancellationToken);
    Task UpdateLastSeenAsync(string id, DateTime lastSeenUtc, CancellationToken cancellationToken);
    Task<(string userId, bool isNew)> EnsureAsync(string? existingToken, CancellationToken cancellationToken);
}
