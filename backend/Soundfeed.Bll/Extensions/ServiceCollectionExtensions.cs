using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Jobs;
using Soundfeed.Bll.Models;
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

        services.AddQuartz(q =>
        {
            var jobKey = new JobKey("ReleaseSyncJob");
            q.AddJob<ReleaseSyncJob>(opts => opts.WithIdentity(jobKey));

            var cronSchedule = configuration["Jobs:ReleaseSyncJob"] ?? "0 0/1 * 1/1 * ? *";

            q.AddTrigger(opts => opts
                .ForJob(jobKey)
                .WithIdentity("ReleaseSyncJob-Trigger")
                .WithCronSchedule(cronSchedule));
        });
        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        services.Configure<SpotifyOptions>(configuration.GetSection(SpotifyOptions.SectionName));

        return services;
    }
}
