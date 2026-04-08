using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Soundfeed.Api.Extensions;
using Soundfeed.Api.Middlewares;
using Soundfeed.Bll.Extensions;
using Soundfeed.Dal;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddBll(builder.Configuration)
    .AddApi(builder.Configuration);

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = ctx =>
    {
        var problem = new ValidationProblemDetails(ctx.ModelState);
        problem.Extensions.Remove("traceId");
        return new BadRequestObjectResult(problem);
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{

    app.UseHttpsRedirection();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseRouting();

app.UseCors("DefaultCorsPolicy");

app.UseMiddleware<UserMiddleware>();
app.UseRateLimiter();

app.Use(async (ctx, next) =>
{
    ctx.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    ctx.Response.Headers.Append("X-Frame-Options", "DENY");
    ctx.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

app.MapControllers();

app.Run();