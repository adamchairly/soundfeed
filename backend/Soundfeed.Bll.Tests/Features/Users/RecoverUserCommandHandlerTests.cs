
using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Exceptions;
using Soundfeed.Bll.Features;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Tests;

[TestFixture]
internal sealed class RecoverUserCommandHandlerTests
{
    [Test]
    public async Task Handle_WhenCodeMatchesUser_ShouldReturnUserId()
    {
        using var context = TestDbContextFactory.Create();
        var user = new User
        {
            Id = "user1",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow.AddDays(-7)
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = new RecoverUserCommandHandler(context);
        var command = new RecoverUserCommand { RecoveryCode = "ABC-DEF" };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.That(result, Is.EqualTo("user1"));
    }

    [Test]
    public async Task Handle_WhenCodeHasWhitespace_ShouldTrimAndMatch()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User
        {
            Id = "user1",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new RecoverUserCommandHandler(context);
        var command = new RecoverUserCommand { RecoveryCode = "  ABC-DEF  " };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.That(result, Is.EqualTo("user1"));
    }

    [Test]
    public async Task Handle_WhenCodeIsLowercase_ShouldNormalizeAndMatch()
    {
        using var context = TestDbContextFactory.Create();
        context.Users.Add(new User
        {
            Id = "user1",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();

        var handler = new RecoverUserCommandHandler(context);
        var command = new RecoverUserCommand { RecoveryCode = "abc-def" };

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.That(result, Is.EqualTo("user1"));
    }

    [Test]
    public void Handle_WhenCodeNotFound_ShouldThrowEntityNotFoundException()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new RecoverUserCommandHandler(context);
        var command = new RecoverUserCommand { RecoveryCode = "XXX-YYY" };

        Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Test]
    public async Task Handle_WhenCodeMatches_ShouldUpdateLastSeenAt()
    {
        using var context = TestDbContextFactory.Create();
        var oldDate = DateTime.UtcNow.AddDays(-30);
        context.Users.Add(new User
        {
            Id = "user1",
            RecoveryCode = "ABC-DEF",
            CreatedAt = DateTime.UtcNow,
            LastSeenAt = oldDate
        });
        await context.SaveChangesAsync();

        var handler = new RecoverUserCommandHandler(context);
        var command = new RecoverUserCommand { RecoveryCode = "ABC-DEF" };

        await handler.Handle(command, CancellationToken.None);

        var updatedUser = await context.Users.FirstAsync(u => u.Id == "user1");
        Assert.That(updatedUser.LastSeenAt, Is.GreaterThan(oldDate));
    }
}
