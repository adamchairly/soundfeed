using Soundfeed.Bll.Exceptions;
using System.Net;

namespace Soundfeed.Api.Middlewares;

internal class ErrorHandlingMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (EntityNotFoundException e)
        {
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            await context.Response.WriteAsJsonAsync(new BaseErrorResponse
            {
                Error = e.StackTrace,
                Code = (int)HttpStatusCode.NotFound,
                Message = e.Message
            });
        }
        catch (Exception e)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await context.Response.WriteAsJsonAsync(new BaseErrorResponse
            {
                Error = e.StackTrace,
                Code = (int)HttpStatusCode.InternalServerError,
                Message = e.Message
            });
        }
    }
}
