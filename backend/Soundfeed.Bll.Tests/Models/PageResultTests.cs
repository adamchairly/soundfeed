using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Tests.Models;

[TestFixture]
internal sealed class PageResultTests
{
    [Test]
    public void TotalPages_WhenDivisible_ShouldReturnExact()
    {
        var result = new PageResult<string>(100, 1, 10, []);

        Assert.That(result.TotalPages, Is.EqualTo(10));
    }

    [Test]
    public void TotalPages_WhenNotDivisible_ShouldRoundUp()
    {
        var result = new PageResult<string>(101, 1, 10, []);

        Assert.That(result.TotalPages, Is.EqualTo(11));
    }

    [Test]
    public void TotalPages_WhenZeroItems_ShouldReturnZero()
    {
        var result = new PageResult<string>(0, 1, 10, []);

        Assert.That(result.TotalPages, Is.EqualTo(0));
    }

    [Test]
    public void TotalPages_WhenLessThanPageSize_ShouldReturnOne()
    {
        var result = new PageResult<string>(5, 1, 10, []);

        Assert.That(result.TotalPages, Is.EqualTo(1));
    }
}
