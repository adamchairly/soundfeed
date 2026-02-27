using Soundfeed.Bll.Exceptions;
using System.Net;

namespace Soundfeed.Api.Middlewares;

internal sealed class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (EntityNotFoundException e)
        {
            await WriteErrorAsync(context, HttpStatusCode.NotFound, ErrorCode.NotFound, e.Message);
        }
        catch (UnauthorizedAccessException e)
        {
            await WriteErrorAsync(context, HttpStatusCode.Unauthorized, ErrorCode.Unauthorized, e.Message);
        }
        catch (ArgumentException e)
        {
            await WriteErrorAsync(context, HttpStatusCode.BadRequest, ErrorCode.BadRequest, e.Message);
        }
        catch (HttpRequestException e)
        {
            _logger.LogError(e, "External service error");
            await WriteErrorAsync(context, HttpStatusCode.BadGateway, ErrorCode.ExternalServiceError, "An external service request failed.");
        }
        catch (InvalidOperationException e)
        {
            _logger.LogError(e, "Invalid operation");
            await WriteErrorAsync(context, HttpStatusCode.BadGateway, ErrorCode.ExternalServiceError, "An external service request failed.");
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Unhandled exception");
            await WriteErrorAsync(context, HttpStatusCode.InternalServerError, ErrorCode.InternalError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, HttpStatusCode statusCode, ErrorCode error, string message)
    {
        context.Response.StatusCode = (int)statusCode;
        await context.Response.WriteAsJsonAsync(new BaseErrorResponse
        {
            Error = error,
            Code = (int)statusCode,
            Message = message
        });
    }
}
