using Microsoft.EntityFrameworkCore;
using Soundfeed.Api.Extensions;
using Soundfeed.Api.Middlewares;
using Soundfeed.Bll.Extensions;
using Soundfeed.Dal;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddBll(builder.Configuration)
    .AddApi(builder.Configuration);

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

app.UseRouting();

app.UseCors("DefaultCorsPolicy");

app.UseMiddleware<UserMiddleware>();
app.UseRateLimiter();

app.MapControllers();

app.Run();