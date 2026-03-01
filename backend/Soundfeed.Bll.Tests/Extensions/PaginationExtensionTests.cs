using Soundfeed.Bll.Extensions;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class PaginationExtensionTests
{
    [Test]
    public async Task ToPageResultAsync_WhenPageIsZero_ShouldDefaultToOne()
    {
        using var context = TestDbContextFactory.Create();
        for (var i = 0; i < 5; i++)
        {
            context.Artists.Add(new Artist
            {
                SpotifyArtistId = $"artist{i}",
                Name = $"Artist {i}",
                SpotifyUrl = $"https://open.spotify.com/artist/artist{i}",
                SpotifyImageUrl = "",
                CreatedAt = DateTime.UtcNow
            });
        }
        await context.SaveChangesAsync();

        var result = await context.Artists.AsQueryable().ToPageResultAsync(0, 10);

        Assert.That(result.Page, Is.EqualTo(1));
        Assert.That(result.Items, Has.Count.EqualTo(5));
    }

    [Test]
    public async Task ToPageResultAsync_WhenPageSizeIsNegative_ShouldDefaultToTen()
    {
        using var context = TestDbContextFactory.Create();
        for (var i = 0; i < 15; i++)
        {
            context.Artists.Add(new Artist
            {
                SpotifyArtistId = $"artist{i}",
                Name = $"Artist {i}",
                SpotifyUrl = $"https://open.spotify.com/artist/artist{i}",
                SpotifyImageUrl = "",
                CreatedAt = DateTime.UtcNow
            });
        }
        await context.SaveChangesAsync();

        var result = await context.Artists.AsQueryable().ToPageResultAsync(1, -5);

        Assert.That(result.PageSize, Is.EqualTo(10));
        Assert.That(result.Items, Has.Count.EqualTo(10));
    }

    [Test]
    public async Task ToPageResultAsync_WhenValidInputs_ShouldReturnCorrectSlice()
    {
        using var context = TestDbContextFactory.Create();
        for (var i = 0; i < 25; i++)
        {
            context.Artists.Add(new Artist
            {
                SpotifyArtistId = $"artist{i}",
                Name = $"Artist {i}",
                SpotifyUrl = $"https://open.spotify.com/artist/artist{i}",
                SpotifyImageUrl = "",
                CreatedAt = DateTime.UtcNow
            });
        }
        await context.SaveChangesAsync();

        var result = await context.Artists.AsQueryable().ToPageResultAsync(2, 10);

        Assert.That(result.Page, Is.EqualTo(2));
        Assert.That(result.PageSize, Is.EqualTo(10));
        Assert.That(result.TotalCount, Is.EqualTo(25));
        Assert.That(result.Items, Has.Count.EqualTo(10));
    }

    [Test]
    public async Task ToPageResultAsync_WhenSourceIsEmpty_ShouldReturnEmptyResult()
    {
        using var context = TestDbContextFactory.Create();

        var result = await context.Artists.AsQueryable().ToPageResultAsync(1, 10);

        Assert.That(result.TotalCount, Is.EqualTo(0));
        Assert.That(result.Items, Is.Empty);
    }

    [Test]
    public void ToPageResultAsync_WhenSourceIsNull_ShouldThrowArgumentNullException()
    {
        IQueryable<Artist> source = null!;

        Assert.ThrowsAsync<ArgumentNullException>(() => source.ToPageResultAsync(1, 10));
    }

    [Test]
    public async Task ToPageResultAsync_WhenPageBeyondData_ShouldReturnEmptyItems()
    {
        using var context = TestDbContextFactory.Create();
        for (var i = 0; i < 5; i++)
        {
            context.Artists.Add(new Artist
            {
                SpotifyArtistId = $"artist{i}",
                Name = $"Artist {i}",
                SpotifyUrl = $"https://open.spotify.com/artist/artist{i}",
                SpotifyImageUrl = "",
                CreatedAt = DateTime.UtcNow
            });
        }
        await context.SaveChangesAsync();

        var result = await context.Artists.AsQueryable().ToPageResultAsync(100, 10);

        Assert.That(result.TotalCount, Is.EqualTo(5));
        Assert.That(result.Items, Is.Empty);
    }
}
