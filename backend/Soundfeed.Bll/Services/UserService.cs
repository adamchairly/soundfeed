using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Dal.Abstractions;
using Soundfeed.Dal.Entites;
using System.Security.Cryptography;

namespace Soundfeed.Bll;

public sealed class UserService(IAppDbContext context, ILogger<UserService> logger) : IUserService
{
    private readonly IAppDbContext _context = context;
    private readonly ILogger<UserService> _logger = logger;

    public Task<User?> FindByIdAsync(string id, CancellationToken cancellationToken) => _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public async Task CreateAsync(User user, CancellationToken cancellationToken)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateLastSeenAsync(string id, DateTime lastSeenUtc, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user is null) return;

        user.LastSeenAt = lastSeenUtc;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<(string userId, bool isNew)> EnsureAsync(string? existingToken, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(existingToken))
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == existingToken, cancellationToken);

            if (userExists)
            {
                await UpdateLastSeenAsync(existingToken, DateTime.UtcNow, cancellationToken);
                return (existingToken, false);
            }
        }
        var newUser = new User
        {
            Id = Guid.NewGuid().ToString("N"),
            RecoveryCode = GenerateRecoveryCode(),
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow,
        };

        await CreateAsync(newUser, cancellationToken);

        return (newUser.Id, true);
    }

    public Task DeleteInactiveAsync(CancellationToken cancellationToken)
    {
        var inactiveUsers = _context.Users.AsNoTracking().Where(u => u.LastSeenAt < DateTime.UtcNow.AddMonths(-1));

        _context.Users.RemoveRange(inactiveUsers);
        _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted {Count} users last seen before {CutoffDate}", inactiveUsers, DateTime.UtcNow.AddMonths(-1));

        return Task.CompletedTask;
    }

    private static string GenerateRecoveryCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        return $"{GetRandomString(3)}-{GetRandomString(3)}";

        string GetRandomString(int length) =>
            new string(Enumerable.Repeat(chars, length)
                .Select(s => s[RandomNumberGenerator.GetInt32(s.Length)]).ToArray());
    }
}
