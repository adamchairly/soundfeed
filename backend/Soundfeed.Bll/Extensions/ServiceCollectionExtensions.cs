using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Jobs;
using Soundfeed.Bll.Models;
using Soundfeed.Bll.Options;
using Soundfeed.Bll.Services;
using Soundfeed.Dal.Extensions;

namespace Soundfeed.Bll.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBll(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDal(configuration);

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(GetArtistQuery).Assembly));

        services.AddHttpClient<ISpotifyService, SpotifyService>();
        services.AddSingleton<ITokenService, TokenService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IReleaseSyncService, ReleaseSyncService>();
        services.AddScoped<IEmailService, EmailService>();

        services.AddQuartz(q =>
        {
            // Release sync job
            var releaseJobKey = new JobKey("ReleaseSyncJob");
            q.AddJob<ReleaseSyncJob>(opts => opts.WithIdentity(releaseJobKey));
            var cronSchedule = configuration["Jobs:ReleaseSyncJob"] ?? "0 0 0/4 ? * * *";
            q.AddTrigger(opts => opts
                .ForJob(releaseJobKey)
                .WithIdentity("ReleaseSyncJob-Trigger")
                .WithCronSchedule(cronSchedule, x => x
                    .WithMisfireHandlingInstructionDoNothing()));

            // Inactive user job
            var userJobKey = new JobKey("InactiveUserJob");
            q.AddJob<InactiveUserJob>(opts => opts.WithIdentity(userJobKey));
            var inactiveUserCron = configuration["Jobs:InactiveUserJob"] ?? "0 0 0 * * ?";
            q.AddTrigger(opts => opts
                .ForJob(userJobKey)
                .WithIdentity("InactiveUserJob-Trigger")
                .WithCronSchedule(inactiveUserCron, x => x
                    .WithMisfireHandlingInstructionDoNothing()));

            // Email job
            var emailJobKey = new JobKey("EmailJob");
            q.AddJob<EmailJob>(opts => opts.WithIdentity(emailJobKey));
            var emailCron = configuration["Jobs:EmailJob"] ?? "0 0 9 * * ?";
            q.AddTrigger(opts => opts
                .ForJob(emailJobKey)
                .WithIdentity("EmailJob-Trigger")
                .WithCronSchedule(emailCron, x => x
                    .WithMisfireHandlingInstructionDoNothing()));
        });


        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        services.Configure<SpotifyOptions>(configuration.GetSection(SpotifyOptions.SectionName));
        services.Configure<EmailOptions>(configuration.GetSection(EmailOptions.SectionName));

        return services;
    }
}
