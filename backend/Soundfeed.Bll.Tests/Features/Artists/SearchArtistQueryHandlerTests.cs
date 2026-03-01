using NSubstitute;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class SearchArtistQueryHandlerTests
{
    private ISpotifyService _spotifyService = null!;
    private SearchArtistQueryHandler _handler = null!;

    [SetUp]
    public void SetUp()
    {
        _spotifyService = Substitute.For<ISpotifyService>();
        _handler = new SearchArtistQueryHandler(_spotifyService);
    }

    [Test]
    public async Task Handle_WhenQueryIsNull_ShouldReturnEmptyList()
    {
        var query = new SearchArtistQuery { Query = null! };

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result, Is.Empty);
        await _spotifyService.DidNotReceive().SearchArtistsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task Handle_WhenQueryIsEmpty_ShouldReturnEmptyList()
    {
        var query = new SearchArtistQuery { Query = "" };

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result, Is.Empty);
        await _spotifyService.DidNotReceive().SearchArtistsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task Handle_WhenQueryIsWhitespace_ShouldReturnEmptyList()
    {
        var query = new SearchArtistQuery { Query = "   " };

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result, Is.Empty);
        await _spotifyService.DidNotReceive().SearchArtistsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task Handle_WhenQueryIsValid_ShouldReturnMappedResults()
    {
        var spotifyResults = new List<ArtistDto>
        {
            new() { Name = "Artist One", ImageUrl = "https://img1.url", SpotifyUrl = "https://open.spotify.com/artist/1" },
            new() { Name = "Artist Two", ImageUrl = "https://img2.url", SpotifyUrl = "https://open.spotify.com/artist/2" }
        };
        _spotifyService.SearchArtistsAsync("test", Arg.Any<CancellationToken>())
            .Returns(spotifyResults);

        var query = new SearchArtistQuery { Query = "test" };

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result, Has.Count.EqualTo(2));
        Assert.That(result[0].Name, Is.EqualTo("Artist One"));
        Assert.That(result[0].ImageUrl, Is.EqualTo("https://img1.url"));
        Assert.That(result[0].SpotifyUrl, Is.EqualTo("https://open.spotify.com/artist/1"));
        Assert.That(result[1].Name, Is.EqualTo("Artist Two"));
    }

    [Test]
    public async Task Handle_WhenSpotifyReturnsEmpty_ShouldReturnEmptyList()
    {
        _spotifyService.SearchArtistsAsync("noresults", Arg.Any<CancellationToken>())
            .Returns(new List<ArtistDto>());

        var query = new SearchArtistQuery { Query = "noresults" };

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result, Is.Empty);
    }
}
