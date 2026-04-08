
using Soundfeed.Bll.Exceptions;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class GetArtistQueryHandlerTests
{
    [Test]
    public async Task Handle_WhenArtistExistsAndUserIsSubscribed_ShouldReturnMappedResponse()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User { Id = "user-1", RecoveryCode = "TEST-CODE", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow };
        var artist = new Artist
        {
            SpotifyArtistId = "spotify123",
            Name = "Test Artist",
            SpotifyUrl = "https://open.spotify.com/artist/spotify123",
            SpotifyImageUrl = "https://img.url/photo.jpg",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        context.Artists.Add(artist);
        await context.SaveChangesAsync();

        context.UserSubscriptions.Add(new UserSubscription { UserId = user.Id, ArtistId = artist.Id, CreatedAt = DateTime.UtcNow });
        await context.SaveChangesAsync();

        var handler = new GetArtistQueryHandler(context);
        var query = new GetArtistQuery { Id = artist.Id, UserId = user.Id };

        var result = await handler.Handle(query, CancellationToken.None);

        Assert.That(result.Id, Is.EqualTo(artist.Id));
        Assert.That(result.Name, Is.EqualTo("Test Artist"));
        Assert.That(result.SpotifyId, Is.EqualTo("spotify123"));
        Assert.That(result.SpotifyUrl, Is.EqualTo("https://open.spotify.com/artist/spotify123"));
        Assert.That(result.ImageUrl, Is.EqualTo("https://img.url/photo.jpg"));
    }

    [Test]
    public void Handle_WhenUserIsNotSubscribed_ShouldThrowEntityNotFoundException()
    {
        using var context = TestDbContextFactory.Create();
        var artist = new Artist
        {
            SpotifyArtistId = "spotify123",
            Name = "Test Artist",
            SpotifyUrl = "https://open.spotify.com/artist/spotify123",
            SpotifyImageUrl = "",
            CreatedAt = DateTime.UtcNow
        };
        context.Artists.Add(artist);
        context.SaveChanges();

        var handler = new GetArtistQueryHandler(context);
        var query = new GetArtistQuery { Id = artist.Id, UserId = "unsubscribed-user" };

        Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(query, CancellationToken.None));
    }

    [Test]
    public void Handle_WhenArtistNotFound_ShouldThrowEntityNotFoundException()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new GetArtistQueryHandler(context);
        var query = new GetArtistQuery { Id = 999, UserId = "any-user" };

        Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(query, CancellationToken.None));
    }
}
