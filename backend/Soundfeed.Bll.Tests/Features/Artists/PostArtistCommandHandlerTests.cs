
using NSubstitute;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class PostArtistCommandHandlerTests
{
    private ISpotifyService _spotifyService = null!;

    [SetUp]
    public void SetUp()
    {
        _spotifyService = Substitute.For<ISpotifyService>();
    }

    [Test]
    public async Task Handle_WhenValidSpotifyUrl_ShouldCreateArtistAndReturnId()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow });
        await context.SaveChangesAsync();

        _spotifyService.GetArtistAsync("abc123", Arg.Any<CancellationToken>())
            .Returns(new ArtistDto { Name = "Test Artist", ImageUrl = "https://img.url/photo.jpg" });

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/abc123", UserId = "user1" };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.That(result, Is.GreaterThan(0));
        Assert.That(context.Artists.Count(), Is.EqualTo(1));
        Assert.That(context.Artists.First().Name, Is.EqualTo("Test Artist"));
    }

    [Test]
    public async Task Handle_WhenArtistExistsInDb_ShouldNotCallSpotifyApi()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow });
        context.Artists.Add(new Artist
        {
            SpotifyArtistId = "existing123",
            Name = "Existing Artist",
            SpotifyUrl = "https://open.spotify.com/artist/existing123",
            SpotifyImageUrl = "https://img.url/photo.jpg",
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/existing123", UserId = "user1" };

        await handler.Handle(command, CancellationToken.None);

        await _spotifyService.DidNotReceive().GetArtistAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task Handle_WhenArtistExistsInDb_ShouldReturnExistingArtistId()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow });
        var artist = new Artist
        {
            SpotifyArtistId = "existing123",
            Name = "Existing Artist",
            SpotifyUrl = "https://open.spotify.com/artist/existing123",
            SpotifyImageUrl = "https://img.url/photo.jpg",
            CreatedAt = DateTime.UtcNow
        };
        context.Artists.Add(artist);
        await context.SaveChangesAsync();

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/existing123", UserId = "user1" };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.That(result, Is.EqualTo(artist.Id));
    }

    [Test]
    public void Handle_WhenSpotifyReturnsNull_ShouldThrowArgumentException()
    {
        using var context = TestDbContextFactory.Create();
        _spotifyService.GetArtistAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns((ArtistDto)null!);

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/unknown", UserId = "user1" };

        Assert.ThrowsAsync<ArgumentException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Test]
    public async Task Handle_WhenUserAlreadySubscribed_ShouldNotDuplicateSubscription()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow };
        var artist = new Artist
        {
            SpotifyArtistId = "abc123",
            Name = "Test Artist",
            SpotifyUrl = "https://open.spotify.com/artist/abc123",
            SpotifyImageUrl = "https://img.url/photo.jpg",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        context.Artists.Add(artist);
        await context.SaveChangesAsync();

        context.UserSubscriptions.Add(new UserSubscription { UserId = "user1", ArtistId = artist.Id, CreatedAt = DateTime.UtcNow });
        await context.SaveChangesAsync();

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/abc123", UserId = "user1" };

        await handler.Handle(command, CancellationToken.None);

        Assert.That(context.UserSubscriptions.Count(), Is.EqualTo(1));
    }

    [Test]
    public async Task Handle_WhenUserNotSubscribed_ShouldCreateSubscription()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow };
        var artist = new Artist
        {
            SpotifyArtistId = "abc123",
            Name = "Test Artist",
            SpotifyUrl = "https://open.spotify.com/artist/abc123",
            SpotifyImageUrl = "https://img.url/photo.jpg",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        context.Artists.Add(artist);
        await context.SaveChangesAsync();

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/abc123", UserId = "user1" };

        await handler.Handle(command, CancellationToken.None);

        Assert.That(context.UserSubscriptions.Count(), Is.EqualTo(1));
        Assert.That(context.UserSubscriptions.First().UserId, Is.EqualTo("user1"));
    }

    [Test]
    public async Task Handle_WhenUrlHasQueryParameters_ShouldExtractIdCorrectly()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User { Id = "user1", RecoveryCode = "ABC-DEF", CreatedAt = DateTime.UtcNow, LastSeenAt = DateTime.UtcNow });
        await context.SaveChangesAsync();

        _spotifyService.GetArtistAsync("abc123", Arg.Any<CancellationToken>())
            .Returns(new ArtistDto { Name = "Test Artist", ImageUrl = "https://img.url/photo.jpg" });

        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/artist/abc123?si=abcdef123456", UserId = "user1" };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.That(result, Is.GreaterThan(0));
        await _spotifyService.Received(1).GetArtistAsync("abc123", Arg.Any<CancellationToken>());
    }

    [Test]
    public void Handle_WhenUrlIsTrackNotArtist_ShouldThrowArgumentException()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/track/abc123", UserId = "user1" };

        Assert.ThrowsAsync<ArgumentException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Test]
    public void Handle_WhenUrlHasTooFewSegments_ShouldThrowArgumentException()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "https://open.spotify.com/", UserId = "user1" };

        Assert.ThrowsAsync<ArgumentException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Test]
    public void Handle_WhenUrlIsCompletelyInvalid_ShouldThrowUriFormatException()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new PostArtistCommandHandler(_spotifyService, context);
        var command = new PostArtistCommand { ArtistUrl = "not-a-valid-url", UserId = "user1" };

        Assert.ThrowsAsync<UriFormatException>(() => handler.Handle(command, CancellationToken.None));
    }
}
