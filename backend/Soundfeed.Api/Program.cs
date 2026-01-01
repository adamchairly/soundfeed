using Soundfeed.Api.Extensions;
using Soundfeed.Api.Middlewares;
using Soundfeed.Bll.Extensions;

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

app.UseRouting();

app.UseCors("DefaultCorsPolicy");

app.UseMiddleware<UserMiddleware>();

app.MapControllers();

app.Run();