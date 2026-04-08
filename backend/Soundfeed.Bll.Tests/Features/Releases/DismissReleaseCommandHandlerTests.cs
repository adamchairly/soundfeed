
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class DismissReleaseCommandHandlerTests
{
    [Test]
    public async Task Handle_WhenReleaseNotFound_ShouldReturnSilently()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new DismissReleaseCommandHandler(context);
        var command = new DismissReleaseCommand { ReleaseId = 999, UserId = "user1" };

        Assert.DoesNotThrowAsync(() => handler.Handle(command, CancellationToken.None));
    }

    [Test]
    public async Task Handle_WhenUserNotFound_ShouldReturnSilently()
    {
        using var context = TestDbContextFactory.Create();
        var artist = new Artist
        {
            SpotifyArtistId = "artist1",
            Name = "Artist",
            SpotifyUrl = "https://open.spotify.com/artist/artist1",
            SpotifyImageUrl = "",
            CreatedAt = DateTime.UtcNow
        };
        context.Artists.Add(artist);
        await context.SaveChangesAsync();

        var release = new Release
        {
            ArtistId = artist.Id,
            SpotifyReleaseId = "rel1",
            SpotifyReleaseUrl = "https://open.spotify.com/album/rel1",
            Title = "Test Release",
            ReleaseType = "album",
            ReleaseDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        context.Releases.Add(release);
        await context.SaveChangesAsync();

        var handler = new DismissReleaseCommandHandler(context);
        var command = new DismissReleaseCommand { ReleaseId = release.Id, UserId = "nonexistent" };

        Assert.DoesNotThrowAsync(() => handler.Handle(command, CancellationToken.None));
    }

    [Test]
    public async Task Handle_WhenUserNotDismissed_ShouldAddToDismissedBy()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow };
        var artist = new Artist
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
        var release = new Release
        {
            ArtistId = artist.Id,
            SpotifyReleaseId = "rel1",
            SpotifyReleaseUrl = "https://open.spotify.com/album/rel1",
            Title = "Test Release",
            ReleaseType = "album",
            ReleaseDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        context.Releases.Add(release);
        await context.SaveChangesAsync();

        var handler = new DismissReleaseCommandHandler(context);
        var command = new DismissReleaseCommand { ReleaseId = release.Id, UserId = "user1" };

        await handler.Handle(command, CancellationToken.None);

        var updatedRelease = await context.Releases
            .Include(r => r.DismissedBy)
            .FirstAsync(r => r.Id == release.Id);
        Assert.That(updatedRelease.DismissedBy, Has.Count.EqualTo(1));
        Assert.That(updatedRelease.DismissedBy.First().Id, Is.EqualTo("user1"));
    }

    [Test]
    public async Task Handle_WhenUserAlreadyDismissed_ShouldNotDuplicate()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow };
        var artist = new Artist
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
        var release = new Release
        {
            ArtistId = artist.Id,
            SpotifyReleaseId = "rel1",
            SpotifyReleaseUrl = "https://open.spotify.com/album/rel1",
            Title = "Test Release",
            ReleaseType = "album",
            ReleaseDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };
        release.DismissedBy.Add(user);
        context.Releases.Add(release);
        await context.SaveChangesAsync();

        var handler = new DismissReleaseCommandHandler(context);
        var command = new DismissReleaseCommand { ReleaseId = release.Id, UserId = "user1" };

        await handler.Handle(command, CancellationToken.None);

        var updatedRelease = await context.Releases
            .Include(r => r.DismissedBy)
            .FirstAsync(r => r.Id == release.Id);
        Assert.That(updatedRelease.DismissedBy, Has.Count.EqualTo(1));
    }
}
