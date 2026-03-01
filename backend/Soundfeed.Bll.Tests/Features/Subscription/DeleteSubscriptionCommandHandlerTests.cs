using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class DeleteSubscriptionCommandHandlerTests
{
    [Test]
    public async Task Handle_WhenSubscriptionExists_ShouldRemoveIt()
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

        context.UserSubscriptions.Add(new UserSubscription { UserId = "user1", ArtistId = artist.Id, CreatedAt = DateTime.UtcNow });
        await context.SaveChangesAsync();

        var handler = new DeleteSubscriptionCommandHandler(context);
        var command = new DeleteSubscriptionCommand { ArtistId = artist.Id, UserId = "user1" };

        await handler.Handle(command, CancellationToken.None);

        Assert.That(context.UserSubscriptions.Count(), Is.EqualTo(0));
    }

    [Test]
    public async Task Handle_WhenSubscriptionNotFound_ShouldNotThrow()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new DeleteSubscriptionCommandHandler(context);
        var command = new DeleteSubscriptionCommand { ArtistId = 999, UserId = "user1" };

        Assert.DoesNotThrowAsync(() => handler.Handle(command, CancellationToken.None));
    }
}
