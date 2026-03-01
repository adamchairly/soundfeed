using System.Text.RegularExpressions;
using Soundfeed.Bll.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Soundfeed.Bll;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests.Services;

[TestFixture]
internal sealed class UserServiceTests
{
    private ILogger<UserService> _logger = null!;

    [SetUp]
    public void SetUp()
    {
        _logger = Substitute.For<ILogger<UserService>>();
    }

    [Test]
    public async Task EnsureAsync_WhenTokenIsValid_ShouldReturnExistingAndIsNewFalse()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User { Id = "existing-token", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow });
        await context.SaveChangesAsync();

        var service = new UserService(context, _logger);

        var (userId, isNew) = await service.EnsureAsync("existing-token", CancellationToken.None);

        Assert.That(userId, Is.EqualTo("existing-token"));
        Assert.That(isNew, Is.False);
    }

    [Test]
    public async Task EnsureAsync_WhenTokenIsValid_ShouldUpdateLastSeenAt()
    {
        using var context = TestDbContextFactory.Create();
        var oldDate = DateTime.UtcNow.AddDays(-7);
        context.Users.Add(new User { Id = "existing-token", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = oldDate });
        await context.SaveChangesAsync();

        var service = new UserService(context, _logger);

        await service.EnsureAsync("existing-token", CancellationToken.None);

        var user = await context.Users.FirstAsync(u => u.Id == "existing-token");
        Assert.That(user.LastSeenAt, Is.GreaterThan(oldDate));
    }

    [Test]
    public async Task EnsureAsync_WhenTokenIsNull_ShouldCreateNewUser()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, isNew) = await service.EnsureAsync(null, CancellationToken.None);

        Assert.That(isNew, Is.True);
        Assert.That(userId, Is.Not.Empty);
    }

    [Test]
    public async Task EnsureAsync_WhenTokenIsEmpty_ShouldCreateNewUser()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, isNew) = await service.EnsureAsync("", CancellationToken.None);

        Assert.That(isNew, Is.True);
        Assert.That(userId, Is.Not.Empty);
    }

    [Test]
    public async Task EnsureAsync_WhenTokenIsWhitespace_ShouldCreateNewUser()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, isNew) = await service.EnsureAsync("   ", CancellationToken.None);

        Assert.That(isNew, Is.True);
        Assert.That(userId, Is.Not.Empty);
    }

    [Test]
    public async Task EnsureAsync_WhenTokenDoesNotExist_ShouldCreateNewUser()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, isNew) = await service.EnsureAsync("nonexistent-token", CancellationToken.None);

        Assert.That(isNew, Is.True);
        Assert.That(userId, Is.Not.EqualTo("nonexistent-token"));
    }

    [Test]
    public async Task EnsureAsync_WhenCreatingUser_ShouldGenerateRecoveryCode()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, _) = await service.EnsureAsync(null, CancellationToken.None);

        var user = await context.Users.FirstAsync(u => u.Id == userId);
        Assert.That(user.RecoveryCode, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public async Task EnsureAsync_WhenCreatingUser_ShouldPersistToDatabase()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, _) = await service.EnsureAsync(null, CancellationToken.None);

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        Assert.That(user, Is.Not.Null);
        Assert.That(user!.CreatedAt, Is.GreaterThan(DateTime.MinValue));
    }

    [Test]
    public async Task EnsureAsync_RecoveryCodeFormat_ShouldMatchXxxDashXxx()
    {
        using var context = TestDbContextFactory.Create();
        var service = new UserService(context, _logger);

        var (userId, _) = await service.EnsureAsync(null, CancellationToken.None);

        var user = await context.Users.FirstAsync(u => u.Id == userId);
        Assert.That(user.RecoveryCode, Does.Match(@"^[A-Z2-9]{3}-[A-Z2-9]{3}$"));
    }

    [Test]
    public async Task DeleteInactiveAsync_WhenLastSeenOverOneMonth_ShouldDelete()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User
        {
            Id = "inactive-user",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow.AddMonths(-3),
            LastSeenAt = DateTime.UtcNow.AddMonths(-2)
        };
        var artist = new Soundfeed.Dal.Entites.Artist
        {
            SpotifyArtistId = "artist1",
            Name = "Artist",
            SpotifyUrl = "https://open.spotify.com/artist/artist1",
            SpotifyImageUrl = "",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        context.Artists.Add(artist);
        await context.SaveChangesAsync();
        context.UserSubscriptions.Add(new UserSubscription { UserId = user.Id, ArtistId = artist.Id, CreatedAt = DateTime.UtcNow });
        await context.SaveChangesAsync();
        context.ChangeTracker.Clear();

        var service = new UserService(context, _logger);
        await service.DeleteInactiveAsync(CancellationToken.None);

        Assert.That(await context.Users.CountAsync(), Is.EqualTo(0));
    }

    [Test]
    public async Task DeleteInactiveAsync_WhenNoSubscriptions_ShouldDelete()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User
        {
            Id = "no-subs-user",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();
        context.ChangeTracker.Clear();

        var service = new UserService(context, _logger);
        await service.DeleteInactiveAsync(CancellationToken.None);

        Assert.That(await context.Users.CountAsync(), Is.EqualTo(0));
    }

    [Test]
    public async Task DeleteInactiveAsync_WhenActiveWithSubscriptions_ShouldKeep()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User
        {
            Id = "active-user",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow
        };
        var artist = new Soundfeed.Dal.Entites.Artist
        {
            SpotifyArtistId = "artist1",
            Name = "Artist",
            SpotifyUrl = "https://open.spotify.com/artist/artist1",
            SpotifyImageUrl = "",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        context.Artists.Add(artist);
        await context.SaveChangesAsync();
        context.UserSubscriptions.Add(new UserSubscription { UserId = user.Id, ArtistId = artist.Id, CreatedAt = DateTime.UtcNow });
        await context.SaveChangesAsync();
        context.ChangeTracker.Clear();

        var service = new UserService(context, _logger);
        await service.DeleteInactiveAsync(CancellationToken.None);

        Assert.That(await context.Users.CountAsync(), Is.EqualTo(1));
    }
}
