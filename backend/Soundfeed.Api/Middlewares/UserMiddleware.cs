using Soundfeed.Bll.Abstractions;
using System.Security.Cryptography;
using System.Text;

namespace Soundfeed.Api.Middlewares;

public sealed class UserMiddleware
{
    private const string CookieName = "uid";
    private readonly IConfiguration _config;
    private readonly RequestDelegate _next;
    private readonly ILogger<UserMiddleware> _logger;

    public UserMiddleware(RequestDelegate next, IConfiguration config, ILogger<UserMiddleware> logger)
    {
        _next = next;
        _config = config;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IUserService service)
    {
        var secret = _config["CookieSettings:SecretKey"];
        if (string.IsNullOrEmpty(secret))
        {
            _logger.LogError("CookieSettings:SecretKey is missing in appsettings.json!");
            throw new Exception("Secret configuration missing");
        }

        context.Request.Cookies.TryGetValue(CookieName, out var cookieValue);

        string? validatedUserId = null;

        if (cookieValue != null)
        {
            var parts = cookieValue.Split('.');
            if (parts.Length == 2)
            {
                var userCookieId = parts[0];
                var signature = parts[1];

                if (CalculateSignature(userCookieId, secret) == signature)
                {
                    validatedUserId = userCookieId;
                    _logger.LogInformation("User validated: {UserId}", validatedUserId);
                }
                else
                {
                    _logger.LogWarning("Invalid cookie signature for user: {UserId}", userCookieId);
                }
            }
        }

        var (userId, isNew) = await service.EnsureAsync(validatedUserId, context.RequestAborted);

        if (isNew || validatedUserId == null)
        {
            var newSignature = CalculateSignature(userId, secret);
            var signedValue = $"{userId}.{newSignature}";

            context.Response.Cookies.Append(CookieName, signedValue, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddYears(1)
            });
        }

        context.Items[ContextKeys.UserId] = userId;
        await _next(context);
    }
    public static string CalculateSignature(string userId, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userId));
        return Convert.ToBase64String(hash);
    }
}

public static class ContextKeys
{
    public const string UserId = "UserId";
}
