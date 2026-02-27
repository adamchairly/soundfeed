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

        throw new UnauthorizedAccessException("User context not initialized.");
    }
}
