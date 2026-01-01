using Soundfeed.Api.Middlewares;

namespace Soundfeed.Api.Extensions;

public static class RequestExtensions
{
    public static string GetRequiredUserId(this HttpRequest request)
    {
        if (request.HttpContext.Items.TryGetValue(ContextKeys.UserId, out var userId) && userId is string userIdString)
        {
            return userIdString;
        }

        if (request.Cookies.TryGetValue("uid", out var cookieValue) && !string.IsNullOrWhiteSpace(cookieValue))
        {
            return cookieValue.Split('.')[0];
        }

        throw new UnauthorizedAccessException("User context not initialized.");
    }
}
