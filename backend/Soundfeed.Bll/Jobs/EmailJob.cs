using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;
using Soundfeed.Dal.Abstractions;

namespace Soundfeed.Bll.Jobs;

[DisallowConcurrentExecution]
public class EmailJob(IServiceProvider serviceProvider, ILogger<EmailJob> logger) : IJob
{
    private readonly ILogger<EmailJob> _logger = logger;

    public async Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("Email Job starting...");

        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

        var usersWithEmail = await dbContext.Users
            .Where(u => u.Email != null && u.EmailNotifications)
            .ToListAsync(context.CancellationToken);

        _logger.LogInformation("Found {Count} users with email addresses", usersWithEmail.Count);

        foreach (var user in usersWithEmail)
        {
            try
            {
                var releases = await mediator.Send(new GetReleasesQuery
                {
                    UserId = user.Id,
                    Page = 1,
                    PageSize = 5,
                    SortDescending = true
                }, context.CancellationToken);

                if (releases.Items.Count > 0)
                {
                    await emailService.SendReleaseDigestAsync(
                        user.Email!,
                        user.RecoveryCode,
                        releases.Items,
                        context.CancellationToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to user {UserId}", user.Id);
            }
        }

        _logger.LogInformation("Email Job finished.");
    }
}