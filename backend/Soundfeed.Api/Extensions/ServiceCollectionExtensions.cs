using System.Threading.RateLimiting;

namespace Soundfeed.Api.Extensions;

public static class ApiServiceCollectionExtensions
{
    public static IServiceCollection AddApi(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy("recovery-limit", context =>
            {
                var remoteIp = context.Connection.RemoteIpAddress?.ToString() ?? context.Request.Headers.Host.ToString();

                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: remoteIp,
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 5,
                        Window = TimeSpan.FromMinutes(15),
                        QueueLimit = 0
                    });
            });

            options.AddPolicy("sync-limit", context =>
            {
                var remoteIp = context.Connection.RemoteIpAddress?.ToString() ?? context.Request.Headers.Host.ToString();

                return RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: remoteIp,
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 1,
                        Window = TimeSpan.FromMinutes(10),
                        QueueLimit = 0
                    });
            });
        });

        services.AddCors(options =>
        {
            options.AddPolicy("DefaultCorsPolicy", policy =>
            {
                var origins = configuration["AllowedOrigins"] ?? "http://localhost:8080";
                var originsArray = origins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                policy.WithOrigins(originsArray)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        return services;
    }
}